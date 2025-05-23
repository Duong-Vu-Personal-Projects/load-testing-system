package com.vn.ptit.duongvct.dto.response.testplan.testrun;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestRunComparisonDTO {
    private TestRunBasicInfo testRun1;
    private TestRunBasicInfo testRun2;

    private List<ComparisonDataPoint> responseTimeComparison;

    private List<ComparisonDataPoint> throughputComparison;

    private ErrorRateComparison errorRateComparison;
    private String testPlanId;
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestRunBasicInfo {
        private String id;
        private String title;
        private String time;
        private String fileName;
        private TestResultStats stats;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComparisonDataPoint {
        private String category;
        private String run;
        private double value;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorRateComparison {
        private List<PieChartData> run1Data;
        private List<PieChartData> run2Data;
        private double run1ErrorRate;
        private double run2ErrorRate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PieChartData {
        private String type;
        private long value;
    }
}