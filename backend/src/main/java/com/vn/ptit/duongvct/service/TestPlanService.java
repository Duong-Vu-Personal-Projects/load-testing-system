package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;

import java.io.IOException;

public interface TestPlanService {
    public ResponseTestPlanDTO runTestPlan(RequestTestPlanDTO dto) throws IOException;
    public ResponseTestPlanDTO mapRequestDTO(RequestTestPlanDTO dto);
}
