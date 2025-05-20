package com.vn.ptit.duongvct.domain.testplan.testresult;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestResultStats {
    private long errorCount;
    private long sampleCounts;
    private double errorRate;
    private long receivedBytes;
    private long sentBytes;
    private long duration;
    private long sampleTimePercentile99;
    private long sampleTimePercentile90;
    private long sampleTimePercentile95;
    private long maxResponseTime;
    private long minResponseTime;
    private long medianResponseTime;
}
