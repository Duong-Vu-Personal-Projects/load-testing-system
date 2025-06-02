package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface TestPlanService {
    public TestPlan createTestPlan(TestPlan testPlan);
    public Optional<TestPlan> findById(String id);
    public TestPlan editTestPlan(TestPlan testPlan);
    public void deleteTestPlanById(String id);
    public TestPlan mapRequestTestPlan(RequestTestPlanDTO dto);
    public ResponseTestPlanDTO mapTestPlan(TestPlan testPlan);
    public PaginationResponse getAllTestPlan(Pageable pageable);
    public PaginationResponse setPaginationResponse (Pageable pageable, Page<TestPlan> pageTestPlan);
    public PaginationResponse searchTestPlans(String keyword, Pageable pageable);
}
