package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.constant.ScheduleType;
import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import com.vn.ptit.duongvct.dto.request.schedule.RequestCreateScheduleDTO;
import com.vn.ptit.duongvct.dto.request.testrun.RequestTestRunDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.schedule.ResponseScheduleDTO;
import com.vn.ptit.duongvct.repository.mongo.TestPlanScheduleRepository;
import com.vn.ptit.duongvct.service.TestPlanScheduleService;
import com.vn.ptit.duongvct.service.TestPlanService;
import com.vn.ptit.duongvct.service.TestRunService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class TestPlanScheduleServiceImpl implements TestPlanScheduleService {
    private static final Logger logger = LoggerFactory.getLogger(TestPlanScheduleServiceImpl.class);

    private final TestPlanScheduleRepository scheduleRepository;
    private final TestPlanService testPlanService;
    private final TestRunService testRunService;
    private final ModelMapper mapper;

    public TestPlanScheduleServiceImpl(TestPlanScheduleRepository scheduleRepository, TestPlanService testPlanService, TestRunService testRunService, ModelMapper mapper) {
        this.scheduleRepository = scheduleRepository;
        this.testPlanService = testPlanService;
        this.testRunService = testRunService;
        this.mapper = mapper;
    }

    @Override
    public ResponseScheduleDTO createSchedule(RequestCreateScheduleDTO request) {
        Optional<TestPlan> testPlanOpt = testPlanService.findById(request.getTestPlanId());
        if (testPlanOpt.isEmpty()) {
            throw new IllegalArgumentException("Test plan not found with id: " + request.getTestPlanId());
        }
        if (scheduleRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Schedule name already exists: " + request.getName());
        }

        TestPlanSchedule schedule = new TestPlanSchedule();
        schedule.setTestPlanId(request.getTestPlanId());
        schedule.setName(request.getName());
        schedule.setType(request.getType());
        schedule.setDescription(request.getDescription());
//        schedule.setCreatedAt(LocalDateTime.now());
//        schedule.setUpdatedAt(LocalDateTime.now());
        schedule.setEnabled(true);

        if (request.getType() == ScheduleType.ONCE) {
            schedule.setExecutionTime(request.getExecutionTime());
            schedule.setNextRunTime(request.getExecutionTime());
        } else {
            schedule.setCronExpression(request.getCronExpression());
            schedule.setNextRunTime(calculateNextRunTime(schedule));
        }

        TestPlanSchedule savedSchedule = scheduleRepository.save(schedule);

        return this.mapToResponseScheduleDTO(savedSchedule, testPlanOpt.get().getTitle());
    }

    @Override
    public Optional<TestPlanSchedule> findById(String id) {
        return scheduleRepository.findById(id);
    }

    @Override
    public ArrayList<ResponseScheduleDTO> getSchedulesByTestPlan(String testPlanId) {
        ArrayList<TestPlanSchedule> schedules = scheduleRepository.findByTestPlanId(testPlanId);
        Optional<TestPlan> testPlanOpt = testPlanService.findById(testPlanId);
        if (testPlanOpt.isEmpty()) {
            throw new IllegalArgumentException("Cannot find test plan with id = " + testPlanId);
        }
        final String title = testPlanOpt.get().getTitle();
        return new ArrayList<>(schedules.stream()
                .map(schedule -> {
                    ResponseScheduleDTO response = mapper.map(schedule, ResponseScheduleDTO.class);
                    response.setTestPlanTitle(title);
                    return response;
                })
                .toList());
    }

    @Override
    public ArrayList<TestPlanSchedule> getSchedulesToRun() {
        return scheduleRepository.findSchedulesToRun(LocalDateTime.now());
    }

    @Override
    public void executeScheduledTest(TestPlanSchedule schedule) {
        try {
            logger.info("Executing scheduled test: {}", schedule.getName());

            RequestTestRunDTO runRequest = new RequestTestRunDTO();
            runRequest.setId(schedule.getTestPlanId());

            testRunService.runTestPlan(runRequest);

            schedule.setLastRunTime(LocalDateTime.now());

            // set enabled for once time and calculate next run time for scheduling
            if (schedule.getType() == ScheduleType.ONCE) {
                schedule.setEnabled(false);
            } else {
                LocalDateTime nextRun = calculateNextRunTime(schedule);
                schedule.setNextRunTime(nextRun);
            }

            scheduleRepository.save(schedule);
            logger.info("Successfully executed scheduled test: {}", schedule.getName());
        } catch (Exception e) {
            logger.error("Failed to execute scheduled test: {}", schedule.getName(), e);
        }
    }

    @Override
    public void updateNextRunTime(TestPlanSchedule schedule) {
        if (schedule.getType() == ScheduleType.RECURRING) {
            schedule.setNextRunTime(calculateNextRunTime(schedule));
            scheduleRepository.save(schedule);
        }
    }

    @Override
    public ResponseScheduleDTO toggleScheduleStatus(String scheduleId) {
        Optional<TestPlanSchedule> scheduleOpt = findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            throw new IllegalArgumentException("Schedule not found with id: " + scheduleId);
        }

        TestPlanSchedule schedule = scheduleOpt.get();
        schedule.setEnabled(!schedule.isEnabled());
//        schedule.setUpdatedAt(LocalDateTime.now());

        // If enabling and it's a recurring schedule, recalculate next run time
        if (schedule.isEnabled() && schedule.getType() == ScheduleType.RECURRING) {
            schedule.setNextRunTime(calculateNextRunTime(schedule));
        }

        TestPlanSchedule savedSchedule = scheduleRepository.save(schedule);
        Optional<TestPlan> testPlanOpt = testPlanService.findById(savedSchedule.getTestPlanId());
        if (testPlanOpt.isEmpty()) {
            throw new IllegalArgumentException("Cannot find test plan relate to schedule with id = " + savedSchedule.getTestPlanId());
        }
        return this.mapToResponseScheduleDTO(savedSchedule, savedSchedule.getTestPlanId());
    }

    @Override
    public void deleteSchedule(String scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }

    @Override
    public PaginationResponse getSchedulesByTestPlanWithPagination(String testPlanId, Pageable pageable) {
        Optional<TestPlan> testPlanOpt = testPlanService.findById(testPlanId);
        if (testPlanOpt.isEmpty()) {
            throw new IllegalArgumentException("Test plan not found with id: " + testPlanId);
        }
        String testPlanTitle = testPlanOpt.get().getTitle();

        Page<TestPlanSchedule> pages = scheduleRepository.findPageByTestPlanId(pageable, testPlanId);

        PaginationResponse response = new PaginationResponse();
        PaginationResponse.Meta meta = new PaginationResponse.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pages.getTotalPages());
        meta.setTotal(pages.getTotalElements());
        response.setMeta(meta);

        ArrayList<ResponseScheduleDTO> scheduleDTOs = new ArrayList<>(pages.getContent().stream()
                .map(schedule -> {
                    ResponseScheduleDTO dto = mapper.map(schedule, ResponseScheduleDTO.class);
                    dto.setTestPlanTitle(testPlanTitle);
                    return dto;
                })
                .toList());

        response.setResult(scheduleDTOs);
        return response;
    }

    @Override
    public ResponseScheduleDTO mapToResponseScheduleDTO(TestPlanSchedule testPlanSchedule, String testPlanTitle) {
        ResponseScheduleDTO dto = this.mapper.map(testPlanSchedule, ResponseScheduleDTO.class);
        dto.setTestPlanTitle(testPlanTitle);
        return dto;
    }

    private LocalDateTime calculateNextRunTime(TestPlanSchedule schedule) {
        LocalDateTime now = LocalDateTime.now();

        if (schedule.getType() == ScheduleType.ONCE) {
            return schedule.getExecutionTime();
        } else if (schedule.getType() == ScheduleType.RECURRING) {
            try {
                CronExpression cronExpression = CronExpression.parse(schedule.getCronExpression());
                return cronExpression.next(now);
            } catch (Exception e) {
                logger.error("Invalid cron expression: {}", schedule.getCronExpression(), e);
                throw new IllegalArgumentException("Invalid cron expression: " + schedule.getCronExpression());
            }
        }

        // Default fallback
        return now.plusDays(1);
    }
}
