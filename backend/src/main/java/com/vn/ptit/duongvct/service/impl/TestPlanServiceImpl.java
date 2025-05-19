package com.vn.ptit.duongvct.service.impl;

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

import java.io.IOException;
import java.time.LocalDateTime;
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
        String fileName = String.valueOf(UUID.randomUUID()) + ".jtl";
        dto.setFileName(fileName);
        String directory = "jmeter/jtls";
        dto.setTime(LocalDateTime.now());
        // Build test plan components
        DslTestPlan testPlanBuilder = testPlan(
                threadGroup(dto.getThreads(), dto.getIterations(),
                        httpSampler(dto.getUrl())
                )
                jtlWriter(directory,fileName)
        );

        // Conditionally add throughput timer only if value is not zero
        if (dto.getThroughputTimer() != 0) {
            testPlanBuilder = testPlanBuilder.children(
                    throughputTimer(dto.getThroughputTimer())
            );
        }

        // Run the test
        TestPlanStats stats = testPlanBuilder.run();
        ResponseTestPlan res = this.mapRequestDTO(dto);
        TestResultStats testResultStats = new TestResultStats();
        testResultStats.setErrorCount(stats.overall().errorsCount());
        testResultStats.setSampleCounts(stats.duration().toMillis());
        testResultStats.setMaxResponseTime(stats.overall().sampleTime().max().toMillis());
        testResultStats.setMinResponseTime(stats.overall().sampleTime().min().toMillis());
        testResultStats.setMedianResponseTime(stats.overall().sampleTime().median().toMillis());
        testResultStats.setErrorRate(testResultStats.getErrorCount() / (stats.overall().samplesCount()));
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
