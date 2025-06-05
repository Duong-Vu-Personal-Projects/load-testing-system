package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.dto.response.testplan.testresult.TestResultDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTestRunDetailDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.TestRunComparisonDTO;
import com.vn.ptit.duongvct.service.TestRunService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TestRunComparisonServiceImplTest {

    @Mock
    private TestRunService testRunService;

    @InjectMocks
    private TestRunComparisonServiceImpl testRunComparisonService;

    private TestRun testRun1;
    private TestRun testRun2;
    private ResponseTestRunDetailDTO testRunDetail1;
    private ResponseTestRunDetailDTO testRunDetail2;
    private TestPlan testPlan;

    @BeforeEach
    void setUp() {
        // Create test plan
        testPlan = new TestPlan();
        testPlan.setId("plan-1");
        testPlan.setTitle("Test Plan 1");

        // Create test runs
        testRun1 = new TestRun();
        testRun1.setId("run-1");
        testRun1.setTitle("Run 1");
        testRun1.setTestPlan(testPlan);
        testRun1.setTime(LocalDateTime.now().minusDays(1));
        testRun1.setFileName("run1.jtl");

        testRun2 = new TestRun();
        testRun2.setId("run-2");
        testRun2.setTitle("Run 2");
        testRun2.setTestPlan(testPlan);
        testRun2.setTime(LocalDateTime.now());
        testRun2.setFileName("run2.jtl");

        // Create test result stats for run 1
        TestResultStats stats1 = new TestResultStats();
        stats1.setSampleCounts(1000);
        stats1.setErrorCount(50);
        stats1.setErrorRate(0.05);
        stats1.setMinResponseTime(10);
        stats1.setMaxResponseTime(500);
        stats1.setMedianResponseTime(100);
        stats1.setSampleTimePercentile90(300);
        stats1.setSampleTimePercentile95(400);
        stats1.setSampleTimePercentile99(450);
        stats1.setDuration(60000); // 60 seconds in ms

        // Create test result stats for run 2
        TestResultStats stats2 = new TestResultStats();
        stats2.setSampleCounts(1200);
        stats2.setErrorCount(20);
        stats2.setErrorRate(0.0167);
        stats2.setMinResponseTime(5);
        stats2.setMaxResponseTime(450);
        stats2.setMedianResponseTime(80);
        stats2.setSampleTimePercentile90(250);
        stats2.setSampleTimePercentile95(350);
        stats2.setSampleTimePercentile99(430);
        stats2.setDuration(60000); // 60 seconds in ms

        testRun1.setStats(stats1);
        testRun2.setStats(stats2);

        // Create test run detail DTOs
        testRunDetail1 = new ResponseTestRunDetailDTO();
        testRunDetail1.setId("run-1");
        testRunDetail1.setTitle("Run 1");
        testRunDetail1.setTestPlan(testPlan);
        testRunDetail1.setTime(testRun1.getTime());
        testRunDetail1.setFileName(testRun1.getFileName());
        testRunDetail1.setStats(stats1);
        testRunDetail1.setResultDTO(new TestResultDTO());

        testRunDetail2 = new ResponseTestRunDetailDTO();
        testRunDetail2.setId("run-2");
        testRunDetail2.setTitle("Run 2");
        testRunDetail2.setTestPlan(testPlan);
        testRunDetail2.setTime(testRun2.getTime());
        testRunDetail2.setFileName(testRun2.getFileName());
        testRunDetail2.setStats(stats2);
        testRunDetail2.setResultDTO(new TestResultDTO());
    }

    @Test
    void compareTestRuns_Success() {
        // Arrange
        when(testRunService.findById("run-1")).thenReturn(Optional.of(testRun1));
        when(testRunService.findById("run-2")).thenReturn(Optional.of(testRun2));
        when(testRunService.mapTestRunToResult(testRun1)).thenReturn(testRunDetail1);
        when(testRunService.mapTestRunToResult(testRun2)).thenReturn(testRunDetail2);

        // Act
        TestRunComparisonDTO result = testRunComparisonService.compareTestRuns("run-1", "run-2");

        // Assert
        assertNotNull(result);
        assertEquals("plan-1", result.getTestPlanId());

        // Verify basic info
        assertEquals("run-1", result.getTestRun1().getId());
        assertEquals("Run 1", result.getTestRun1().getTitle());
        assertEquals("run-2", result.getTestRun2().getId());
        assertEquals("Run 2", result.getTestRun2().getTitle());

        // Verify response time comparison
        assertNotNull(result.getResponseTimeComparison());
        assertEquals(12, result.getResponseTimeComparison().size()); // 6 metrics * 2 runs

        // Check specific response time data points
        verifyComparisonDataPoints(result.getResponseTimeComparison(), "Min", "Run 1", 10);
        verifyComparisonDataPoints(result.getResponseTimeComparison(), "Min", "Run 2", 5);
        verifyComparisonDataPoints(result.getResponseTimeComparison(), "Max", "Run 1", 500);
        verifyComparisonDataPoints(result.getResponseTimeComparison(), "Max", "Run 2", 450);

        // Verify throughput comparison
        assertNotNull(result.getThroughputComparison());
        assertEquals(4, result.getThroughputComparison().size()); // 2 metrics * 2 runs

        // Check specific throughput data points
        verifyComparisonDataPoints(result.getThroughputComparison(), "Total Requests", "Run 1", 1000);
        verifyComparisonDataPoints(result.getThroughputComparison(), "Total Requests", "Run 2", 1200);

        // Calculate expected RPS values
        double expectedRps1 = 1000 / (60000 / 1000.0); // 16.67 RPS
        double expectedRps2 = 1200 / (60000 / 1000.0); // 20 RPS
        verifyComparisonDataPoints(result.getThroughputComparison(), "Requests/sec", "Run 1", expectedRps1);
        verifyComparisonDataPoints(result.getThroughputComparison(), "Requests/sec", "Run 2", expectedRps2);

        // Verify error rate comparison
        assertNotNull(result.getErrorRateComparison());
        assertEquals(0.05, result.getErrorRateComparison().getRun1ErrorRate(), 0.001);
        assertEquals(0.0167, result.getErrorRateComparison().getRun2ErrorRate(), 0.001);

        // Verify pie chart data
        assertNotNull(result.getErrorRateComparison().getRun1Data());
        assertEquals(2, result.getErrorRateComparison().getRun1Data().size());
        assertEquals("Success", result.getErrorRateComparison().getRun1Data().get(0).getType());
        assertEquals(950, result.getErrorRateComparison().getRun1Data().get(0).getValue()); // 1000 - 50 = 950
        assertEquals("Error", result.getErrorRateComparison().getRun1Data().get(1).getType());
        assertEquals(50, result.getErrorRateComparison().getRun1Data().get(1).getValue());

        assertNotNull(result.getErrorRateComparison().getRun2Data());
        assertEquals(2, result.getErrorRateComparison().getRun2Data().size());
        assertEquals("Success", result.getErrorRateComparison().getRun2Data().get(0).getType());
        assertEquals(1180, result.getErrorRateComparison().getRun2Data().get(0).getValue()); // 1200 - 20 = 1180
        assertEquals("Error", result.getErrorRateComparison().getRun2Data().get(1).getType());
        assertEquals(20, result.getErrorRateComparison().getRun2Data().get(1).getValue());
    }

    @Test
    void compareTestRuns_FirstTestRunNotFound() {
        // Arrange
        when(testRunService.findById("run-1")).thenReturn(Optional.empty());
        when(testRunService.findById("run-2")).thenReturn(Optional.of(testRun2));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testRunComparisonService.compareTestRuns("run-1", "run-2")
        );
        assertEquals("One or both test runs not found", exception.getMessage());
    }

    @Test
    void compareTestRuns_SecondTestRunNotFound() {
        // Arrange
        when(testRunService.findById("run-1")).thenReturn(Optional.of(testRun1));
        when(testRunService.findById("run-2")).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testRunComparisonService.compareTestRuns("run-1", "run-2")
        );
        assertEquals("One or both test runs not found", exception.getMessage());
    }

    @Test
    void compareTestRuns_BothTestRunsNotFound() {
        // Arrange
        when(testRunService.findById("run-1")).thenReturn(Optional.empty());
        when(testRunService.findById("run-2")).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testRunComparisonService.compareTestRuns("run-1", "run-2")
        );
        assertEquals("One or both test runs not found", exception.getMessage());
    }

    /**
     * Helper method to verify comparison data points in list
     */
    private void verifyComparisonDataPoints(List<TestRunComparisonDTO.ComparisonDataPoint> dataPoints,
                                            String category, String run, double expectedValue) {
        boolean found = false;
        for (TestRunComparisonDTO.ComparisonDataPoint point : dataPoints) {
            if (point.getCategory().equals(category) && point.getRun().equals(run)) {
                assertEquals(expectedValue, point.getValue(), 0.001);
                found = true;
                break;
            }
        }
        assertTrue(found, "Data point not found for category: " + category + ", run: " + run);
    }
}