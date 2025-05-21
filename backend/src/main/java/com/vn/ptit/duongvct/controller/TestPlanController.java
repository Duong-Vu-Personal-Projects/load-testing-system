package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;
import com.vn.ptit.duongvct.service.TestPlanService;
import com.vn.ptit.duongvct.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/plan")
public class TestPlanController {
    private final TestPlanService testPlanService;

    public TestPlanController(TestPlanService testPlanService) {
        this.testPlanService = testPlanService;
    }

    @PostMapping
    @ApiMessage("Create a test plan")
    public ResponseEntity<ResponseTestPlanDTO> createTestPlan(@RequestBody RequestTestPlanDTO dto) throws Exception {
        TestPlan testPlan = this.testPlanService.mapRequestTestPlan(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.testPlanService.mapTestPlan(this.testPlanService.createTestPlan(testPlan)));
    }
    @GetMapping
    @ApiMessage("Get All test plan with pagination")
    public ResponseEntity<PaginationResponse> getAllTestPlanswithPagination(Pageable pageable) {
        return ResponseEntity.ok(this.testPlanService.getAllTestPlan(pageable));
    }
    @PutMapping
    @ApiMessage("Edit a test plan")
    public ResponseEntity<ResponseTestPlanDTO> editTestPlan(@RequestBody TestPlan dto) {
        return ResponseEntity.ok().body(this.testPlanService.mapTestPlan(this.testPlanService.editTestPlan(dto)));
    }
    @DeleteMapping("/{id}")
    @ApiMessage("Delete a test plan by id")
    public ResponseEntity<Void> deleteTestPlan(@PathVariable String id) {
        this.testPlanService.deleteTestPlanById(id);
        return ResponseEntity.ok(null);
    }
}
