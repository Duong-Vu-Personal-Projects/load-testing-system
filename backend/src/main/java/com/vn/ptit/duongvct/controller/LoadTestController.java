package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseRunTestPlanDTO;

import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDetailDTO;
import com.vn.ptit.duongvct.service.TestPlanService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/load-test")
public class LoadTestController {
    private final TestPlanService testPlanService;

    public LoadTestController(TestPlanService testPlanService) {
        this.testPlanService = testPlanService;
    }

    @PostMapping("/run")
    public ResponseEntity<ResponseRunTestPlanDTO> runTestPlan(@RequestBody RequestTestPlanDTO dto) throws Exception {
        return ResponseEntity.ok(this.testPlanService.runTestPlan(dto));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseTestPlanDetailDTO> getTestPlan(@PathVariable String id) throws IllegalArgumentException {
        Optional< TestPlan> testPlan = this.testPlanService.findById(id);
        if (testPlan.isEmpty()) {
            throw new IllegalArgumentException("Test Plan with id = " + id + " not found");
        }
        return ResponseEntity.ok(this.testPlanService.mapTestPlanToResult(testPlan.get()));
    }
    @GetMapping
    public ResponseEntity<PaginationResponse> getAllTestPlanswithPagination(Pageable pageable) {
        return ResponseEntity.ok(this.testPlanService.getAllTestPlan(pageable));
    }
}