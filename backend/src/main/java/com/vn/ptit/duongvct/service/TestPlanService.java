package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlan;

import java.io.IOException;

public interface TestPlanService {
    public ResponseTestPlan runTestPlan(RequestTestPlanDTO dto) throws IOException;
    public ResponseTestPlan mapRequestDTO(RequestTestPlanDTO dto);
    public ResponseTestPlan createTestPlan(ResponseTestPlan testPlan);
}
