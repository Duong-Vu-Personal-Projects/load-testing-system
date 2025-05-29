package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import com.vn.ptit.duongvct.dto.request.schedule.RequestCreateScheduleDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.schedule.ResponseScheduleDTO;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

public interface TestPlanScheduleService {
    ResponseScheduleDTO createSchedule(RequestCreateScheduleDTO request);
    Optional<TestPlanSchedule> findById(String id);
    ArrayList<TestPlanSchedule> getSchedulesToRun();
    void executeScheduledTest(TestPlanSchedule schedule);
    ResponseScheduleDTO toggleScheduleStatus(String scheduleId);
    void deleteSchedule(String scheduleId);
    PaginationResponse getSchedulesByTestPlanWithPagination(String testPlanId, Pageable pageable);
    ResponseScheduleDTO mapToResponseScheduleDTO(TestPlanSchedule testPlanSchedule, String testPlanTitle);
    PaginationResponse searchSchedulesByName(String testPlanId, String name, Pageable pageable);
    PaginationResponse searchSchedulesByStatus(String testPlanId,boolean enabled, Pageable pageable);
    PaginationResponse searchSchedulesByNextRunTime(String testPlanId, LocalDateTime start, LocalDateTime end, Pageable pageable);

}
