package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseRunTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDetailDTO;

import java.io.IOException;
import java.util.Optional;

public interface TestPlanService {
    public ResponseRunTestPlanDTO runTestPlan(RequestTestPlanDTO dto) throws IOException;
    public TestPlan mapRequestDTO(RequestTestPlanDTO dto);
    public TestPlan createTestPlan(TestPlan testPlan);
    public ResponseRunTestPlanDTO mapTestPlan(TestPlan testPlan);
    public Optional<TestPlan> findById(String id);
    public ResponseTestPlanDetailDTO mapTestPlanToResult(TestPlan testPlan);
}
