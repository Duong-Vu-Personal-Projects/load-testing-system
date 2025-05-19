package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.ThreadStageGroup;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlan;
import com.vn.ptit.duongvct.dto.response.testplan.TestResultStats;
import com.vn.ptit.duongvct.repository.mongo.TestPlanRepository;
import com.vn.ptit.duongvct.service.TestPlanService;
import com.vn.ptit.duongvct.util.JTLParser;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import us.abstracta.jmeter.javadsl.core.DslTestPlan;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;
import us.abstracta.jmeter.javadsl.core.threadgroups.DslDefaultThreadGroup;
import us.abstracta.jmeter.javadsl.core.threadgroups.RpsThreadGroup;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import static us.abstracta.jmeter.javadsl.JmeterDsl.*;
@Service
public class TestPlanServiceImpl implements TestPlanService {
    private final ModelMapper mapper;
    private final TestPlanRepository testPlanRepository;
    public TestPlanServiceImpl(ModelMapper mapper, TestPlanRepository testPlanRepository) {
        this.mapper = mapper;
        this.testPlanRepository = testPlanRepository;
    }

    @Override
    public ResponseTestPlan runTestPlan(RequestTestPlanDTO dto) throws IOException {
        if (this.testPlanRepository.existsByTitle(dto.getTitle())) {
            throw new IllegalArgumentException("Title is already exists. Please choose another title name");
        }
        String fileName = String.valueOf(UUID.randomUUID()) + ".jtl";
        String directory = "jmeter/jtls";

        ArrayList<DslDefaultThreadGroup> threadGroups = new ArrayList<>();
        for (ThreadStageGroup stage : dto.getThreadStageGroups()) {
            DslDefaultThreadGroup dslDefaultThreadGroup = threadGroup();
            if (stage.getHoldDuration() > 0) {
                // If there's a hold duration, use rampToAndHold
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
            dslDefaultThreadGroup.children(httpSampler(stage.getUrl()));
            threadGroups.add(dslDefaultThreadGroup);
        }
        ArrayList<RpsThreadGroup> rpThreadGroups = new ArrayList<>();
        for (RpsThreadStageGroup stage : dto.getRpsThreadStageGroups()) {
            RpsThreadGroup rpsThreadGroup = rpsThreadGroup();
            if (stage.getHoldDuration() > 0) {
                // If there's a hold duration, use rampToAndHold
                rpsThreadGroup.rampToAndHold(
                        stage.getRampToThreads(),
                        Duration.ofSeconds(stage.getRampDuration()),
                        Duration.ofSeconds(stage.getHoldDuration())
                );
            } else {
                // Otherwise just use rampTo
                rpsThreadGroup.rampTo(
                        stage.getRampToThreads(),
                        Duration.ofSeconds(stage.getRampDuration())
                );
            }
            if (stage.getThroughputTimer() != 0) {
                rpsThreadGroup.children(throughputTimer(stage.getThroughputTimer()));
            }
            rpsThreadGroup.children(httpSampler(stage.getUrl()));
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
        dslTestPlan.saveAsJmx("jmx/" + fileName + ".jmx");
        // Run the test
        TestPlanStats stats = dslTestPlan.run();
        ResponseTestPlan res = this.mapRequestDTO(dto);
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
        res.setRecords(JTLParser.parseJtlFile(directory + "/" + fileName));
        return this.createTestPlan(res);
    }


    @Override
    public ResponseTestPlan mapRequestDTO(RequestTestPlanDTO dto) {
        return this.mapper.map(dto, ResponseTestPlan.class);
    }

    @Override
    public ResponseTestPlan createTestPlan(ResponseTestPlan testPlan) {
        if (this.testPlanRepository.existsByTitle(testPlan.getTitle())) {
            throw new IllegalArgumentException("Title is already exists. Please choose another title name");
        }
        return this.testPlanRepository.save(testPlan);
    }
}
