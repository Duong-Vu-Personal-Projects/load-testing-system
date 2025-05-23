package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import com.vn.ptit.duongvct.dto.response.testplan.testresult.TestResultDTO;

public interface TestResultService {
    TestResults createTestResult(TestResults testResults);
    TestResultDTO getTestResultById(String id);
    public void deleteTestResult(TestResults testResults);
}