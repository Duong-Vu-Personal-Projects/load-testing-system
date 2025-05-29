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
import com.vn.ptit.duongvct.repository.search.TestRunSearchRepository;
import com.vn.ptit.duongvct.service.TestResultService;
import com.vn.ptit.duongvct.service.TestRunService;
import com.vn.ptit.duongvct.util.JTLParser;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
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
    private final TestRunSearchRepository testRunSearchRepository;
    private static final Logger logger = LoggerFactory.getLogger(TestRunServiceImpl.class);

    public TestRunServiceImpl(ModelMapper mapper, TestRunRepository testRunRepository, TestResultService testResultService, TestPlanRepository testPlanRepository, TestRunSearchRepository testRunSearchRepository) {
        this.mapper = mapper;
        this.testRunRepository = testRunRepository;
        this.testResultService = testResultService;
        this.testPlanRepository = testPlanRepository;
        this.testRunSearchRepository = testRunSearchRepository;
    }

    @Override
    public ResponseRunTestPlanDTO runTestPlan(RequestTestRunDTO dto) throws IOException {
        MDC.put("testPlanId", dto.getId());
        logger.info("Starting test plan execution for plan ID: {}", dto.getId());
        long startTime = System.currentTimeMillis();
        try {
            Optional<TestPlan> testPlanOptional = this.testPlanRepository.findById(dto.getId());
            if (testPlanOptional.isEmpty()) {
                logger.error("Test plan not found with ID: {}", dto.getId());
                throw new IllegalArgumentException("Test Plan Id is not valid!");
            }
            long count = this.testRunRepository.countByTestPlanId(dto.getId());
            logger.debug("Found {} previous runs for test plan ID: {}", count, dto.getId());
            TestPlan testPlan = testPlanOptional.get();
            String fileName = String.valueOf(UUID.randomUUID()) + ".jtl";
            String directory = "jmeter/jtls";
            logger.debug("Preparing JMeter test for plan: {}, filename: {}", testPlan.getTitle(), fileName);
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
            logger.info("Executing JMeter test for plan: {}", testPlan.getTitle());
            TestPlanStats stats = dslTestPlan.run();
            long executionTime = System.currentTimeMillis() - startTime;
            logger.info("Test execution completed in {}ms for plan: {}", executionTime, testPlan.getTitle());
            logger.info("Test results - Errors: {}, Samples: {}, Error Rate: {}, Duration: {}ms",
                    stats.overall().errorsCount(),
                    stats.overall().samplesCount(),
                    (double) stats.overall().errorsCount() / stats.overall().samplesCount(),
                    stats.duration().toMillis());
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
            TestRun result = this.createTestRun(res);
            logger.info("Test run created with ID: {} for plan: {}", result.getId(), testPlan.getTitle());
            return this.mapTestRun(result);
        } catch (IOException e) {
            logger.error("Error executing test plan: {}", dto.getId(), e);
            throw e;
        } finally {
            MDC.remove("testPlanId");
        }


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
    public PaginationResponse getAllTestRunOfTestPlan(Pageable pageable, String testPlanId,
                                                      String title, LocalDateTime startDate, LocalDateTime endDate) {
        Optional<TestPlan> testPlanOptional = testPlanRepository.findById(testPlanId);
        if (testPlanOptional.isEmpty()) {
            throw new IllegalArgumentException("Test plan with id = " + testPlanId + " not found");
        }
        Page<TestRun> pages;
        if (title != null || startDate != null || endDate != null) {
            pages = testRunRepository.findByTestPlanIdWithFlexibleCriteria(testPlanId, startDate, endDate, pageable);
        } else {
            pages = testRunSearchRepository.findByTestPlanId(testPlanId, pageable);
        }

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
    public ArrayList<TestRun> getAllTestRunOfATestPlan(String testPlanId) {
        return testRunRepository.findByTestPlanId(testPlanId);
    }

    @Override
    public void deleteTestRun(TestRun testRun) {
        MDC.put("testRunId", testRun.getId());
        try {
            logger.info("Deleting test run: {}", testRun.getId());
            TestResults testResults = testRun.getResults();
            this.testResultService.deleteTestResult(testResults);
            this.testRunSearchRepository.delete(testRun);
            this.testRunRepository.delete(testRun);
            logger.info("Test run deleted: {}", testRun.getId());
        } finally {
            MDC.remove("testRunId");
        }
    }

    @Override
    public TestRun createTestRun(TestRun testRun) {
        MDC.put("testRunId", testRun.getId() != null ? testRun.getId() : "new");
        try {
            logger.debug("Creating test run for plan: {}", testRun.getTestPlan().getTitle());
            this.testRunSearchRepository.save(testRun);
            TestRun savedRun = this.testRunRepository.save(testRun);
            logger.info("Created test run with ID: {}", savedRun.getId());
            return savedRun;
        } finally {
            MDC.remove("testRunId");
        }
    }
}
