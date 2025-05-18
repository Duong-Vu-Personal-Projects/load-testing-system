package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;

import com.vn.ptit.duongvct.service.TestPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/load-test")
public class LoadTestController {
    private final TestPlanService testPlanService;

    public LoadTestController(TestPlanService testPlanService) {
        this.testPlanService = testPlanService;
    }

    @PostMapping("/run")
    public ResponseEntity<ResponseTestPlanDTO> runTestPlan(@RequestBody RequestTestPlanDTO dto) throws Exception {
        return ResponseEntity.ok(this.testPlanService.runTestPlan(dto));
    }
}