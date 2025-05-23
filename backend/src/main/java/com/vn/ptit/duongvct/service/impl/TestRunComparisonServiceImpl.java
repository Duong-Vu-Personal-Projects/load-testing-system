package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTestRunDetailDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.TestRunComparisonDTO;
import com.vn.ptit.duongvct.service.TestRunComparisonService;
import com.vn.ptit.duongvct.service.TestRunService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TestRunComparisonServiceImpl implements TestRunComparisonService {
    private final TestRunService testRunService;

    public TestRunComparisonServiceImpl(TestRunService testRunService) {
        this.testRunService = testRunService;
    }

    @Override
    public TestRunComparisonDTO compareTestRuns(String testRunId1, String testRunId2) {
        Optional<TestRun> testRunOptional1 = testRunService.findById(testRunId1);
        Optional<TestRun> testRunOptional2 = testRunService.findById(testRunId2);

        if (testRunOptional1.isEmpty() || testRunOptional2.isEmpty()) {
            throw new IllegalArgumentException("One or both test runs not found");
        }

        ResponseTestRunDetailDTO testRunDetail1 = testRunService.mapTestRunToResult(testRunOptional1.get());
        ResponseTestRunDetailDTO testRunDetail2 = testRunService.mapTestRunToResult(testRunOptional2.get());

        TestRunComparisonDTO comparisonDTO = new TestRunComparisonDTO();
        comparisonDTO.setTestPlanId(testRunDetail1.getTestPlan().getId());
        DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                .appendPattern("yyyy-MM-dd HH:mm:ss")
                .optionalStart()
                .appendLiteral('.')
                .appendFraction(java.time.temporal.ChronoField.MILLI_OF_SECOND, 3, 3, false)
                .optionalEnd()
                .toFormatter();
        comparisonDTO.setTestRun1(new TestRunComparisonDTO.TestRunBasicInfo(
                testRunDetail1.getId(),
                testRunDetail1.getTitle(),
                testRunDetail1.getTime().format(formatter),
                testRunDetail1.getFileName(),
                testRunDetail1.getStats()
        ));
        comparisonDTO.setTestRun2(new TestRunComparisonDTO.TestRunBasicInfo(
                testRunDetail2.getId(),
                testRunDetail2.getTitle(),
                testRunDetail2.getTime().format(formatter),
                testRunDetail2.getFileName(),
                testRunDetail2.getStats()
        ));

        // Process and set response time comparison data
        comparisonDTO.setResponseTimeComparison(createResponseTimeComparisonData(testRunDetail1, testRunDetail2));

        // Process and set throughput comparison data
        comparisonDTO.setThroughputComparison(createThroughputComparisonData(testRunDetail1, testRunDetail2));

        comparisonDTO.setErrorRateComparison(createErrorRateComparisonData(testRunDetail1, testRunDetail2));

        return comparisonDTO;
    }

    private List<TestRunComparisonDTO.ComparisonDataPoint> createResponseTimeComparisonData(
            ResponseTestRunDetailDTO testRun1,
            ResponseTestRunDetailDTO testRun2
    ) {
        List<TestRunComparisonDTO.ComparisonDataPoint> data = new ArrayList<>();

        // Min
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Min", testRun1.getTitle(), testRun1.getStats().getMinResponseTime()));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Min", testRun2.getTitle(), testRun2.getStats().getMinResponseTime()));

        // Median
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Median", testRun1.getTitle(), testRun1.getStats().getMedianResponseTime()));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Median", testRun2.getTitle(), testRun2.getStats().getMedianResponseTime()));

        // 90th percentile
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("90th", testRun1.getTitle(), testRun1.getStats().getSampleTimePercentile90()));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("90th", testRun2.getTitle(), testRun2.getStats().getSampleTimePercentile90()));

        // 95th percentile
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("95th", testRun1.getTitle(), testRun1.getStats().getSampleTimePercentile95()));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("95th", testRun2.getTitle(), testRun2.getStats().getSampleTimePercentile95()));

        // 99th percentile
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("99th", testRun1.getTitle(), testRun1.getStats().getSampleTimePercentile99()));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("99th", testRun2.getTitle(), testRun2.getStats().getSampleTimePercentile99()));

        // Max
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Max", testRun1.getTitle(), testRun1.getStats().getMaxResponseTime()));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Max", testRun2.getTitle(), testRun2.getStats().getMaxResponseTime()));

        return data;
    }

    private List<TestRunComparisonDTO.ComparisonDataPoint> createThroughputComparisonData(
            ResponseTestRunDetailDTO testRun1,
            ResponseTestRunDetailDTO testRun2
    ) {
        List<TestRunComparisonDTO.ComparisonDataPoint> data = new ArrayList<>();

        // Calculate requests per second
        double rps1 = testRun1.getStats().getSampleCounts() / (testRun1.getStats().getDuration() / 1000.0);
        double rps2 = testRun2.getStats().getSampleCounts() / (testRun2.getStats().getDuration() / 1000.0);

        // Total requests
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Total Requests", testRun1.getTitle(), testRun1.getStats().getSampleCounts()));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Total Requests", testRun2.getTitle(), testRun2.getStats().getSampleCounts()));

        // Requests per second
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Requests/sec", testRun1.getTitle(), rps1));
        data.add(new TestRunComparisonDTO.ComparisonDataPoint("Requests/sec", testRun2.getTitle(), rps2));

        return data;
    }

    private TestRunComparisonDTO.ErrorRateComparison createErrorRateComparisonData(
            ResponseTestRunDetailDTO testRun1,
            ResponseTestRunDetailDTO testRun2
    ) {
        TestRunComparisonDTO.ErrorRateComparison errorRateComparison = new TestRunComparisonDTO.ErrorRateComparison();

        // Create pie chart data for test run 1
        List<TestRunComparisonDTO.PieChartData> run1Data = new ArrayList<>();
        run1Data.add(new TestRunComparisonDTO.PieChartData("Success", testRun1.getStats().getSampleCounts() - testRun1.getStats().getErrorCount()));
        run1Data.add(new TestRunComparisonDTO.PieChartData("Error", testRun1.getStats().getErrorCount()));
        errorRateComparison.setRun1Data(run1Data);

        // Create pie chart data for test run 2
        List<TestRunComparisonDTO.PieChartData> run2Data = new ArrayList<>();
        run2Data.add(new TestRunComparisonDTO.PieChartData("Success", testRun2.getStats().getSampleCounts() - testRun2.getStats().getErrorCount()));
        run2Data.add(new TestRunComparisonDTO.PieChartData("Error", testRun2.getStats().getErrorCount()));
        errorRateComparison.setRun2Data(run2Data);

        // Set error rates
        errorRateComparison.setRun1ErrorRate(testRun1.getStats().getErrorRate());
        errorRateComparison.setRun2ErrorRate(testRun2.getStats().getErrorRate());

        return errorRateComparison;
    }
}