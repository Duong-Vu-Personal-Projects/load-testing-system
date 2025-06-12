package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultRecord;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import com.vn.ptit.duongvct.dto.response.testplan.testresult.TestResultDTO;
import com.vn.ptit.duongvct.repository.mongo.TestResultRepository;
import com.vn.ptit.duongvct.repository.search.TestResultSearchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TestResultServiceImplTest {

    @Mock
    private TestResultRepository testResultRepository;

    @Mock
    private TestResultSearchRepository testResultSearchRepository;

    @InjectMocks
    private TestResultServiceImpl testResultService;

    private TestResults testResults;
    private List<TestResultRecord> testRecords;
    private final String TEST_ID = "test-result-id-123";

    @BeforeEach
    void setUp() {
        // Setup test records
        testRecords = new ArrayList<TestResultRecord>();

        // Create first test record with success=true
        TestResultRecord record1 = new TestResultRecord();
        record1.setTimeStamp(1624600000000L);  // Some timestamp
        record1.setElapsed(150L);  // 150ms
        record1.setLabel("Homepage");
        record1.setResponseCode(200);
        record1.setResponseMessage("OK");
        record1.setThreadName("Thread Group 1-1");
        record1.setDataType("text");
        record1.setSuccess(true);
        record1.setFailureMessage("");
        record1.setBytes(4096L);
        record1.setSentBytes(1024L);
        record1.setGrpThreads(5);
        record1.setAllThreads(10);
        record1.setURL("http://example.com");
        record1.setLatency(120L);
        record1.setIdleTime(10L);
        record1.setConnect(20L);
        record1.setRelativeTime(0.0);
        record1.setReadableTime("12:00:00");
        testRecords.add(record1);

        // Create second test record with success=false
        TestResultRecord record2 = new TestResultRecord();
        record2.setTimeStamp(1624600001000L);  // 1 second later
        record2.setElapsed(300L);  // 300ms
        record2.setLabel("Login");
        record2.setResponseCode(500);
        record2.setResponseMessage("Internal Server Error");
        record2.setThreadName("Thread Group 1-2");
        record2.setDataType("text");
        record2.setSuccess(false);
        record2.setFailureMessage("Server Error");
        record2.setBytes(1024L);
        record2.setSentBytes(512L);
        record2.setGrpThreads(5);
        record2.setAllThreads(10);
        record2.setURL("http://example.com/login");
        record2.setLatency(250L);
        record2.setIdleTime(20L);
        record2.setConnect(30L);
        record2.setRelativeTime(1.0);
        record2.setReadableTime("12:00:01");
        testRecords.add(record2);

        // Create test results
        testResults = new TestResults();
        testResults.setId(TEST_ID);
        testResults.setRecords(new ArrayList<>(testRecords));
    }

    @Test
    void testCreateTestResult() {
        // Arrange
        when(testResultRepository.save(any(TestResults.class))).thenReturn(testResults);

        // Act
        TestResults result = testResultService.createTestResult(testResults);

        // Assert
        assertNotNull(result);
        assertEquals(TEST_ID, result.getId());
        assertEquals(2, result.getRecords().size());
        verify(testResultSearchRepository).save(testResults);
        verify(testResultRepository).save(testResults);
    }

    @Test
    void testGetTestResultById_Success() {
        // Arrange
        when(testResultRepository.findById(TEST_ID)).thenReturn(Optional.of(testResults));

        // Act
        TestResultDTO resultDTO = testResultService.getTestResultById(TEST_ID);

        // Assert
        assertNotNull(resultDTO);
        assertEquals(TEST_ID, resultDTO.getId());
        assertEquals(2, resultDTO.getSampleCount());
        assertEquals(1, resultDTO.getErrorCount());
        assertEquals(0.5, resultDTO.getErrorRate(), 0.001); // 1 error in 2 samples = 50% error rate

        // Check arrays
        assertEquals(2, resultDTO.getTimeStamps().size());
        assertEquals(2, resultDTO.getElapsedTimes().size());
        assertEquals(2, resultDTO.getLabels().size());
        assertEquals(2, resultDTO.getResponseCodes().size());
        assertEquals(2, resultDTO.getResponseMessages().size());
        assertEquals(2, resultDTO.getThreadNames().size());
        assertEquals(2, resultDTO.getDataTypes().size());
        assertEquals(2, resultDTO.getSuccesses().size());
        assertEquals(2, resultDTO.getFailureMessages().size());
        assertEquals(2, resultDTO.getBytes().size());
        assertEquals(2, resultDTO.getSentBytes().size());
        assertEquals(2, resultDTO.getGrpThreads().size());
        assertEquals(2, resultDTO.getAllThreads().size());
        assertEquals(2, resultDTO.getUrls().size());
        assertEquals(2, resultDTO.getLatencies().size());
        assertEquals(2, resultDTO.getIdleTimes().size());
        assertEquals(2, resultDTO.getConnectTimes().size());
        assertEquals(2, resultDTO.getRelativeTimes().size());
        assertEquals(2, resultDTO.getReadableTimes().size());

        // Check specific values from converted arrays
        assertEquals(1624600000000L, resultDTO.getTimeStamps().get(0));
        assertEquals(300L, resultDTO.getElapsedTimes().get(1));
        assertEquals("Homepage", resultDTO.getLabels().get(0));
        assertEquals(500, resultDTO.getResponseCodes().get(1));
        assertTrue(resultDTO.getSuccesses().get(0));
        assertFalse(resultDTO.getSuccesses().get(1));
        assertEquals("Server Error", resultDTO.getFailureMessages().get(1));
        assertEquals("http://example.com", resultDTO.getUrls().get(0));
        assertEquals("http://example.com/login", resultDTO.getUrls().get(1));

        // Check throughput data
        assertNotNull(resultDTO.getThroughputData());
        assertEquals(2, resultDTO.getThroughputData().size());
    }

    @Test
    void testGetTestResultById_NotFound() {
        // Arrange
        when(testResultRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testResultService.getTestResultById("non-existent-id")
        );

        assertEquals("Test Result with id = non-existent-id not found", exception.getMessage());
    }

    @Test
    void testGetTestResultById_NullRecords() {
        // Arrange
        TestResults emptyResults = new TestResults();
        emptyResults.setId(TEST_ID);
        emptyResults.setRecords(null);

        when(testResultRepository.findById(TEST_ID)).thenReturn(Optional.of(emptyResults));

        // Act
        TestResultDTO resultDTO = testResultService.getTestResultById(TEST_ID);

        // Assert
        assertNotNull(resultDTO);
        assertEquals(TEST_ID, resultDTO.getId());
        assertEquals(0, resultDTO.getSampleCount());
        assertEquals(0, resultDTO.getErrorCount());
        assertEquals(0.0, resultDTO.getErrorRate(), 0.001);
    }

    @Test
    void testDeleteTestResult() {
        // Act
        testResultService.deleteTestResult(testResults);

        // Assert
        verify(testResultSearchRepository).delete(testResults);
        verify(testResultRepository).delete(testResults);
    }

    @Test
    void testCalculateThroughput() {
        // Arrange
        when(testResultRepository.findById(TEST_ID)).thenReturn(Optional.of(testResults));

        // Act
        TestResultDTO resultDTO = testResultService.getTestResultById(TEST_ID);

        // Assert
        List<double[]> throughputData = resultDTO.getThroughputData();
        assertNotNull(throughputData);
        assertEquals(2, throughputData.size());

        // First data point should be at relative time 0.0 with count 1
        assertEquals(0.0, throughputData.get(0)[0], 0.001);
        assertEquals(1.0, throughputData.get(0)[1], 0.001);

        // Second data point should be at relative time 1.0 with count 1
        assertEquals(1.0, throughputData.get(1)[0], 0.001);
        assertEquals(1.0, throughputData.get(1)[1], 0.001);
    }
}