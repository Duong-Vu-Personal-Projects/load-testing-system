package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import com.vn.ptit.duongvct.dto.request.schedule.RequestCreateScheduleDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.schedule.ResponseScheduleDTO;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Optional;

public interface TestPlanScheduleService {
    ResponseScheduleDTO createSchedule(RequestCreateScheduleDTO request);
    Optional<TestPlanSchedule> findById(String id);
    ArrayList<ResponseScheduleDTO> getSchedulesByTestPlan(String testPlanId);
    ArrayList<TestPlanSchedule> getSchedulesToRun();
    void executeScheduledTest(TestPlanSchedule schedule);
    void updateNextRunTime(TestPlanSchedule schedule);
    ResponseScheduleDTO toggleScheduleStatus(String scheduleId);
    void deleteSchedule(String scheduleId);
    PaginationResponse getSchedulesByTestPlanWithPagination(String testPlanId, Pageable pageable);

}
