package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.TestResultRecord;
import com.vn.ptit.duongvct.dto.response.testplan.TestResultStats;
import com.vn.ptit.duongvct.service.TestPlanService;
import com.vn.ptit.duongvct.util.JTLParser;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import us.abstracta.jmeter.javadsl.core.DslTestPlan;
import us.abstracta.jmeter.javadsl.core.TestPlanStats;

import java.io.IOException;
import java.util.ArrayList;
import java.util.UUID;

import static us.abstracta.jmeter.javadsl.JmeterDsl.*;
@Service
public class TestPlanServiceImpl implements TestPlanService {
    private final ModelMapper mapper;

    public TestPlanServiceImpl(ModelMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public ResponseTestPlanDTO runTestPlan(RequestTestPlanDTO dto) throws IOException {
//        if (dto.getThroughputTimer() == 0) {
//            dto.setThroughputTimer(dto.getThreads());
//        }
        String fileName = String.valueOf(UUID.randomUUID()) + ".jtl";
        dto.setFileName(fileName);
        String directory = "jmeter/jtls";
        // Build test plan components
        DslTestPlan testPlanBuilder = testPlan(
                threadGroup(dto.getThreads(), dto.getIterations(),
                        httpSampler(dto.getUrl())
                ),
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
        ResponseTestPlanDTO res = this.mapRequestDTO(dto);
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

        return res;
    }


    @Override
    public ResponseTestPlanDTO mapRequestDTO(RequestTestPlanDTO dto) {
        return this.mapper.map(dto, ResponseTestPlanDTO.class);
    }
}
