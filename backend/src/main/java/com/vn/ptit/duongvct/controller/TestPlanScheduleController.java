package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.dto.request.schedule.RequestCreateScheduleDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.schedule.ResponseScheduleDTO;
import com.vn.ptit.duongvct.service.TestPlanScheduleService;
import com.vn.ptit.duongvct.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/schedule")
public class TestPlanScheduleController {

    private final TestPlanScheduleService scheduleService;

    public TestPlanScheduleController(TestPlanScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    @ApiMessage("Create a new test plan schedule")
    public ResponseEntity<ResponseScheduleDTO> createSchedule(@RequestBody RequestCreateScheduleDTO request) {
        ResponseScheduleDTO schedule = scheduleService.createSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(schedule);
    }

    @GetMapping("/plan/{testPlanId}")
    @ApiMessage("Get schedules for a test plan with pagination")
    public ResponseEntity<PaginationResponse> getSchedulesByTestPlanPaginated(
            @PathVariable String testPlanId,
            Pageable pageable) {
        PaginationResponse response = scheduleService.getSchedulesByTestPlanWithPagination(testPlanId, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{scheduleId}/toggle")
    @ApiMessage("Toggle schedule active status")
    public ResponseEntity<ResponseScheduleDTO> toggleScheduleStatus(@PathVariable String scheduleId) {
        ResponseScheduleDTO schedule = scheduleService.toggleScheduleStatus(scheduleId);
        return ResponseEntity.ok(schedule);
    }

    @DeleteMapping("/{scheduleId}")
    @ApiMessage("Delete a schedule")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.ok().build();
    }
}
