package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import com.vn.ptit.duongvct.dto.request.testrun.RequestTestRunDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseRunTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTableTestRunDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTestRunDetailDTO;
import com.vn.ptit.duongvct.repository.mongo.TestPlanRepository;
import com.vn.ptit.duongvct.repository.mongo.TestRunRepository;
import com.vn.ptit.duongvct.service.TestResultService;
import com.vn.ptit.duongvct.service.TestRunService;
import com.vn.ptit.duongvct.util.JTLParser;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import us.abstracta.jmeter.javadsl.core.DslTestPlan;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;
import us.abstracta.jmeter.javadsl.core.threadgroups.DslDefaultThreadGroup;
import us.abstracta.jmeter.javadsl.core.threadgroups.RpsThreadGroup;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static us.abstracta.jmeter.javadsl.JmeterDsl.*;
import static us.abstracta.jmeter.javadsl.JmeterDsl.jtlWriter;

@Service
public class TestRunServiceImpl implements TestRunService {
    private final ModelMapper mapper;
    private final TestRunRepository testRunRepository;
    private final TestResultService testResultService;
    private final TestPlanRepository testPlanRepository;

    public TestRunServiceImpl(ModelMapper mapper, TestRunRepository testRunRepository, TestResultService testResultService, TestPlanRepository testPlanRepository) {
        this.mapper = mapper;
        this.testRunRepository = testRunRepository;
        this.testResultService = testResultService;
        this.testPlanRepository = testPlanRepository;
    }

    @Override
    public ResponseRunTestPlanDTO runTestPlan(RequestTestRunDTO dto) throws IOException {
        Optional<TestPlan> testPlanOptional = this.testPlanRepository.findById(dto.getId());
        if (testPlanOptional.isEmpty()) {
            throw new IllegalArgumentException("Test Plan Id is not valid!");
        }
        long count = this.testRunRepository.countByTestPlanId(dto.getId());

        TestPlan testPlan = testPlanOptional.get();
        String fileName = String.valueOf(UUID.randomUUID()) + ".jtl";
        String directory = "jmeter/jtls";

        ArrayList<DslDefaultThreadGroup> threadGroups = new ArrayList<>();
        for (ThreadStageGroup stage : testPlan.getThreadStageGroups()) {
            DslDefaultThreadGroup dslDefaultThreadGroup = threadGroup();
            if (stage.getHoldDuration() > 0) {
                dslDefaultThreadGroup.rampToAndHold(
                        stage.getRampToThreads(),
                        Duration.ofSeconds(stage.getRampDuration()),
                        Duration.ofSeconds(stage.getHoldDuration())
                );
            } else {
                dslDefaultThreadGroup.rampTo(
                        stage.getRampToThreads(),
                        Duration.ofSeconds(stage.getRampDuration())
                ).holdIterating(stage.getHoldIteration());
            }
            if (stage.getThroughputTimer() != 0) {
                dslDefaultThreadGroup.children(throughputTimer(stage.getThroughputTimer()));
            }
            dslDefaultThreadGroup.children(httpSampler(stage.getUrl()).followRedirects(stage.isFollowRedirects()));
            threadGroups.add(dslDefaultThreadGroup);
        }
        ArrayList<RpsThreadGroup> rpThreadGroups = new ArrayList<>();
        for (RpsThreadStageGroup stage : testPlan.getRpsThreadStageGroups()) {
            RpsThreadGroup rpsThreadGroup = rpsThreadGroup();
            if (stage.getHoldDuration() > 0) {
                rpsThreadGroup.rampToAndHold(
                        stage.getRampToThreads(),
                        Duration.ofSeconds(stage.getRampDuration()),
                        Duration.ofSeconds(stage.getHoldDuration())
                );
            } else {
                rpsThreadGroup.rampTo(
                        stage.getRampToThreads(),
                        Duration.ofSeconds(stage.getRampDuration())
                );
            }
            if (stage.getThroughputTimer() != 0) {
                rpsThreadGroup.children(throughputTimer(stage.getThroughputTimer()));
            }
            rpsThreadGroup.children(httpSampler(stage.getUrl()).followRedirects(stage.isFollowRedirects()));
            rpThreadGroups.add(rpsThreadGroup);
        }
        DslTestPlan dslTestPlan = testPlan();
        for (DslDefaultThreadGroup dslDefaultThreadGroup : threadGroups) {
            dslTestPlan.children(dslDefaultThreadGroup);
        }
        for (RpsThreadGroup rpsThreadGroup : rpThreadGroups) {
            dslTestPlan.children(rpsThreadGroup);
        }
        dslTestPlan.children(jtlWriter(directory, fileName));
        dslTestPlan.saveAsJmx("jmeter/jmx/" + fileName + ".jmx");
        // Run the test
        TestPlanStats stats = dslTestPlan.run();
        TestRun res = new TestRun();
        res.setTitle("Run " + (count + 1));
        res.setTestPlan(testPlan);
        res.setFileName(fileName);
        res.setTime(LocalDateTime.now());

        TestResultStats testResultStats = new TestResultStats();
        testResultStats.setErrorCount(stats.overall().errorsCount());
        testResultStats.setSampleCounts(stats.duration().toMillis());
        testResultStats.setMaxResponseTime(stats.overall().sampleTime().max().toMillis());
        testResultStats.setMinResponseTime(stats.overall().sampleTime().min().toMillis());
        testResultStats.setMedianResponseTime(stats.overall().sampleTime().median().toMillis());
        testResultStats.setErrorRate((double) (testResultStats.getErrorCount()) / (stats.overall().samplesCount()));
        testResultStats.setReceivedBytes(stats.overall().receivedBytes().total());
        testResultStats.setSampleTimePercentile90(stats.overall().sampleTime().perc90().toMillis());
        testResultStats.setSampleTimePercentile95(stats.overall().sampleTime().perc95().toMillis());
        testResultStats.setSampleTimePercentile99(stats.overall().sampleTimePercentile99().toMillis());
        testResultStats.setSentBytes(stats.overall().sentBytes().total());
        testResultStats.setDuration(stats.duration().toMillis());

        res.setStats(testResultStats);

        TestResults results = new TestResults();
        results.setRecords(JTLParser.parseJtlFile(directory + "/" + fileName));
        res.setResults(this.testResultService.createTestResult(results));

        return this.mapTestRun(this.createTestRun(res));
    }

    @Override
    public ResponseRunTestPlanDTO mapTestRun(TestRun testRun) {
        return mapper.map(testRun, ResponseRunTestPlanDTO.class);
    }



    @Override
    public ResponseTestRunDetailDTO mapTestRunToResult(TestRun testRun) {
        ResponseTestRunDetailDTO res =  mapper.map(testRun, ResponseTestRunDetailDTO.class);
        res.setResultDTO(this.testResultService.getTestResultById(testRun.getResults().getId()));
        return res;
    }

    @Override
    public Optional<TestRun> findById(String id) {
        return this.testRunRepository.findById(id);
    }

    @Override
    public PaginationResponse getAllTestRunOfTestPlan(Pageable pageable, String testPlanId) {
        Optional<TestPlan> testPlanOptional = testPlanRepository.findById(testPlanId);
        if (testPlanOptional.isEmpty()) {
            throw new IllegalArgumentException("Test plan with id = " + testPlanId + " not found");
        }

        Page<TestRun> pages = testRunRepository.findPagesByTestPlanId(pageable, testPlanId);


        PaginationResponse response = new PaginationResponse();
        PaginationResponse.Meta meta = new PaginationResponse.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pages.getTotalPages());
        meta.setTotal(pages.getTotalElements());
        response.setMeta(meta);


        List<ResponseTableTestRunDTO> testRunDTOs = pages.getContent().stream()
                .map(testRun -> mapper.map(testRun, ResponseTableTestRunDTO.class))
                .collect(Collectors.toList());

        response.setResult(testRunDTOs);
        return response;
    }

    @Override
    public ArrayList<ResponseTableTestRunDTO> getAllTestRunOfTestPlan(String testPlanId) {
        ArrayList<TestRun> testRuns = testRunRepository.findByTestPlanId(testPlanId);
        return new ArrayList<>(testRuns.stream()
                .map(testRun -> mapper.map(testRun, ResponseTableTestRunDTO.class))
                .collect(Collectors.toList()));
    }

    @Override
    public ArrayList<TestRun> getAllTestRunOfATestPlan(String testPlanId) {
        return testRunRepository.findByTestPlanId(testPlanId);
    }

    @Override
    public void deleteTestRun(TestRun testRun) {
        TestResults testResults = testRun.getResults();
        this.testResultService.deleteTestResult(testResults);
        this.testRunRepository.delete(testRun);
    }

    @Override
    public TestRun createTestRun(TestRun testRun) {
        return this.testRunRepository.save(testRun);
    }
}
