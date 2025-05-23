package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultRecord;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import com.vn.ptit.duongvct.dto.response.testplan.testresult.TestResultDTO;
import com.vn.ptit.duongvct.repository.mongo.TestResultRepository;
import com.vn.ptit.duongvct.service.TestResultService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TestResultServiceImpl implements TestResultService {
    private final TestResultRepository testResultRepository;

    public TestResultServiceImpl(TestResultRepository testResultRepository) {
        this.testResultRepository = testResultRepository;
    }

    @Override
    public TestResults createTestResult(TestResults testResults) {
        return testResultRepository.save(testResults);
    }

    @Override
    public TestResultDTO getTestResultById(String id) {
        Optional<TestResults> testResultsOptional = testResultRepository.findById(id);
        if (testResultsOptional.isEmpty()) {
            throw new IllegalArgumentException("Test Result with id = " + id + " not found");
        }

        TestResults testResults = testResultsOptional.get();
        return convertToDTO(testResults);
    }

    @Override
    public void deleteTestResult(TestResults testResults) {
        this.testResultRepository.delete(testResults);
    }

    /**
     * Converts a TestResults entity to a TestResultDTO with arrays for each attribute
     */
    private TestResultDTO convertToDTO(TestResults testResults) {
        if (testResults == null || testResults.getRecords() == null) {
            return new TestResultDTO();
        }

        List<TestResultRecord> records = testResults.getRecords();

        TestResultDTO dto = new TestResultDTO();
        dto.setId(testResults.getId());

        // Extract each attribute as an array
        List<Long> timestamps = new ArrayList<>();
        List<Long> elapsedTimes = new ArrayList<>();
        List<String> labels = new ArrayList<>();
        List<Integer> responseCodes = new ArrayList<>();
        List<String> responseMessages = new ArrayList<>();
        List<String> threadNames = new ArrayList<>();
        List<String> dataTypes = new ArrayList<>();
        List<Boolean> successes = new ArrayList<>();
        List<String> failureMessages = new ArrayList<>();
        List<Long> bytesList = new ArrayList<>();
        List<Long> sentBytesList = new ArrayList<>();
        List<Integer> grpThreadsList = new ArrayList<>();
        List<Integer> allThreadsList = new ArrayList<>();
        List<String> urls = new ArrayList<>();
        List<Long> latencies = new ArrayList<>();
        List<Long> idleTimes = new ArrayList<>();
        List<Long> connectTimes = new ArrayList<>();
        List<Double> relativeTimes = new ArrayList<>();
        List<String> readableTimes = new ArrayList<>();

        // Populate the arrays
        for (TestResultRecord record : records) {
            timestamps.add(record.getTimeStamp());
            elapsedTimes.add(record.getElapsed());
            labels.add(record.getLabel());
            responseCodes.add(record.getResponseCode());
            responseMessages.add(record.getResponseMessage());
            threadNames.add(record.getThreadName());
            dataTypes.add(record.getDataType());
            successes.add(record.isSuccess());
            failureMessages.add(record.getFailureMessage());
            bytesList.add(record.getBytes());
            sentBytesList.add(record.getSentBytes());
            grpThreadsList.add(record.getGrpThreads());
            allThreadsList.add(record.getAllThreads());
            urls.add(record.getURL());
            latencies.add(record.getLatency());
            idleTimes.add(record.getIdleTime());
            connectTimes.add(record.getConnect());
            relativeTimes.add(record.getRelativeTime());
            readableTimes.add(record.getReadableTime());
        }

        // Set all arrays in the DTO
        dto.setTimeStamps(timestamps);
        dto.setElapsedTimes(elapsedTimes);
        dto.setLabels(labels);
        dto.setResponseCodes(responseCodes);
        dto.setResponseMessages(responseMessages);
        dto.setThreadNames(threadNames);
        dto.setDataTypes(dataTypes);
        dto.setSuccesses(successes);
        dto.setFailureMessages(failureMessages);
        dto.setBytes(bytesList);
        dto.setSentBytes(sentBytesList);
        dto.setGrpThreads(grpThreadsList);
        dto.setAllThreads(allThreadsList);
        dto.setUrls(urls);
        dto.setLatencies(latencies);
        dto.setIdleTimes(idleTimes);
        dto.setConnectTimes(connectTimes);
        dto.setRelativeTimes(relativeTimes);
        dto.setReadableTimes(readableTimes);

        // Calculate some additional useful metrics
        dto.setErrorCount((int) successes.stream().filter(success -> !success).count());
        dto.setSampleCount(records.size());
        dto.setErrorRate(dto.getSampleCount() > 0 ? (double) dto.getErrorCount() / dto.getSampleCount() : 0);

        // Calculate throughput data (requests per second)
        if (!relativeTimes.isEmpty()) {
            dto.setThroughputData(calculateThroughput(records));
        }

        return dto;
    }

    /**
     * Calculate throughput (requests per second) from test records
     */
    private List<double[]> calculateThroughput(List<TestResultRecord> records) {
        // Group records by second and count them
        return records.stream()
                .collect(Collectors.groupingBy(
                        record -> Math.floor(record.getRelativeTime()),
                        Collectors.counting()))
                .entrySet().stream()
                .sorted(java.util.Map.Entry.comparingByKey())
                .map(entry -> new double[] { entry.getKey(), entry.getValue() })
                .collect(Collectors.toList());
    }
}