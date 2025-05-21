package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.dto.request.testrun.RequestTestRunDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseRunTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTestRunDetailDTO;
import com.vn.ptit.duongvct.service.TestRunService;
import com.vn.ptit.duongvct.util.annotation.ApiMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/test-run")
public class TestRunController {
    private final TestRunService testRunService;

    public TestRunController(TestRunService testRunService) {
        this.testRunService = testRunService;
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
}
