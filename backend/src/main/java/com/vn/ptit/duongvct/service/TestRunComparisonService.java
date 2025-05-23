package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.dto.response.testplan.testrun.TestRunComparisonDTO;

public interface TestRunComparisonService {
    TestRunComparisonDTO compareTestRuns(String testRunId1, String testRunId2);
}