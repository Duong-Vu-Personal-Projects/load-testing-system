package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.service.TestPlanScheduleService;
import com.vn.ptit.duongvct.service.TestPlanService;
import com.vn.ptit.duongvct.service.TestRunService;
import com.vn.ptit.duongvct.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final TestPlanService testPlanService;
    private final TestRunService testRunService;
    private final TestPlanScheduleService scheduleService;

    public SearchController(TestPlanService testPlanService, TestRunService testRunService, TestPlanScheduleService scheduleService) {
        this.testPlanService = testPlanService;
        this.testRunService = testRunService;
        this.scheduleService = scheduleService;
    }

    @GetMapping("/test-plans")
    @ApiMessage("Search test plans by title")
    public ResponseEntity<PaginationResponse> searchTestPlans(
            @RequestParam String q,
            Pageable pageable) {
        return ResponseEntity.ok(testPlanService.searchTestPlans(q, pageable));
    }

}
