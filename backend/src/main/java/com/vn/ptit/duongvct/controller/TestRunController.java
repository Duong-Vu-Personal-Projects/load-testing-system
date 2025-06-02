package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.dto.request.testrun.RequestTestRunDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseRunTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTestRunDetailDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.TestRunComparisonDTO;
import com.vn.ptit.duongvct.service.TestRunComparisonService;
import com.vn.ptit.duongvct.service.TestRunService;
import com.vn.ptit.duongvct.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/test-run")
public class TestRunController {
    private final TestRunService testRunService;
    private final TestRunComparisonService testRunComparisonService;
    public TestRunController(TestRunService testRunService, TestRunComparisonService testRunComparisonService) {
        this.testRunService = testRunService;
        this.testRunComparisonService = testRunComparisonService;
    }

    @PostMapping("/run")
    @ApiMessage("Run a test plan")
    public ResponseEntity<ResponseRunTestPlanDTO> runTestPlan(@RequestBody RequestTestRunDTO dto) throws Exception {
        return ResponseEntity.ok(this.testRunService.runTestPlan(dto));
    }

    @GetMapping("/{id}")
    @ApiMessage("Get test run detail")
    public ResponseEntity<ResponseTestRunDetailDTO> getATestRunDetail(@PathVariable String id) {
        Optional<TestRun> optionalTestRun = this.testRunService.findById(id);
        if (optionalTestRun.isEmpty()) {
            throw new IllegalArgumentException("Cannot find test run with id = " + id);
        }
        return ResponseEntity.ok(this.testRunService.mapTestRunToResult(optionalTestRun.get()));
    }
    @GetMapping("/plan/{testPlanId}")
    @ApiMessage("Get test runs for a test plan with pagination and optional search criteria")
    public ResponseEntity<PaginationResponse> getTestRunsForTestPlanPaginated(
            @PathVariable String testPlanId,
            Pageable pageable,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(this.testRunService.getAllTestRunOfTestPlan(pageable, testPlanId, title, startDate, endDate));
    }
    @GetMapping("/compare/{runId1}/{runId2}")
    @ApiMessage("Compare two test runs")
    public ResponseEntity<TestRunComparisonDTO> compareTestRuns(
            @PathVariable String runId1,
            @PathVariable String runId2) {
        return ResponseEntity.ok(this.testRunComparisonService.compareTestRuns(runId1, runId2));
    }
    @DeleteMapping("/{id}")
    @ApiMessage("Delete a test run")
    public ResponseEntity<Void> deleteATestRun(@PathVariable String id) {
        Optional<TestRun> testRunOptional = this.testRunService.findById(id);
        if (testRunOptional.isEmpty()) {
            throw new IllegalArgumentException("Test Run with id = " + id + " not found");
        }
        this.testRunService.deleteTestRun(testRunOptional.get());
        return ResponseEntity.ok(null);
    }
}
