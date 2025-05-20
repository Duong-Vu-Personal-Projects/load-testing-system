package com.vn.ptit.duongvct.dto.response.testplan.testresult;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TestResultDTO {
    private String id;
    private List<Long> timeStamps;
    private List<Long> elapsedTimes;
    private List<String> labels;
    private List<Integer> responseCodes;
    private List<String> responseMessages;
    private List<String> threadNames;
    private List<String> dataTypes;
    private List<Boolean> successes;
    private List<String> failureMessages;
    private List<Long> bytes;
    private List<Long> sentBytes;
    private List<Integer> grpThreads;
    private List<Integer> allThreads;
    private List<String> urls;
    private List<Long> latencies;
    private List<Long> idleTimes;
    private List<Long> connectTimes;
    private List<Double> relativeTimes;
    private List<String> readableTimes;

    // Aggregated statistics
    private int errorCount;
    private int sampleCount;
    private double errorRate;

    // Throughput data: [second, count]
    private List<double[]> throughputData;
}