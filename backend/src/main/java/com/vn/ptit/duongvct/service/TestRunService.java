package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.dto.request.testrun.RequestTestRunDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseRunTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTestRunDetailDTO;

import java.io.IOException;
import java.util.Optional;

public interface TestRunService {
    public ResponseRunTestPlanDTO runTestPlan(RequestTestRunDTO dto) throws IOException;
    public ResponseRunTestPlanDTO mapTestRun(TestRun testRun);
    public TestRun createTestRun(TestRun testRun);
    public ResponseTestRunDetailDTO mapTestRunToResult(TestRun testRun);
    public Optional<TestRun> findById(String id);
}
