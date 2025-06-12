package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.constant.ScheduleType;
import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import com.vn.ptit.duongvct.dto.request.schedule.RequestCreateScheduleDTO;
import com.vn.ptit.duongvct.dto.request.schedule.RequestEditScheduleDTO;
import com.vn.ptit.duongvct.dto.request.testrun.RequestTestRunDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.schedule.ResponseScheduleDTO;
import com.vn.ptit.duongvct.repository.mongo.TestPlanScheduleRepository;
import com.vn.ptit.duongvct.repository.search.TestPlanScheduleSearchRepository;
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
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TestPlanScheduleServiceImpl implements TestPlanScheduleService {
    private static final Logger logger = LoggerFactory.getLogger(TestPlanScheduleServiceImpl.class);
    private final TestPlanScheduleSearchRepository scheduleSearchRepository;
    private final TestPlanScheduleRepository scheduleRepository;
    private final TestPlanService testPlanService;
    private final TestRunService testRunService;
    private final ModelMapper mapper;

    public TestPlanScheduleServiceImpl(TestPlanScheduleSearchRepository scheduleSearchRepository, TestPlanScheduleRepository scheduleRepository, TestPlanService testPlanService, TestRunService testRunService, ModelMapper mapper) {
        this.scheduleSearchRepository = scheduleSearchRepository;
        this.scheduleRepository = scheduleRepository;
        this.testPlanService = testPlanService;
        this.testRunService = testRunService;
        this.mapper = mapper;
    }

    @Override
    public ResponseScheduleDTO createSchedule(RequestCreateScheduleDTO request) {
        // Validate test plan existence
        TestPlan testPlan = validateTestPlanExists(request.getTestPlanId());

        // Validate schedule name uniqueness
        validateScheduleNameUniqueness(request.getName(), request.getTestPlanId(), null);

        // Create new schedule
        TestPlanSchedule schedule = new TestPlanSchedule();
        schedule.setTestPlanId(request.getTestPlanId());
        schedule.setName(request.getName());
        schedule.setType(request.getType());
        schedule.setDescription(request.getDescription());
        schedule.setEnabled(true);

        // Set type-specific fields
        setScheduleTypeSpecificFields(schedule, request.getType(),
                request.getExecutionTime(), request.getCronExpression());

        // Save the schedule
        TestPlanSchedule savedSchedule = saveSchedule(schedule);

        return mapToResponseScheduleDTO(savedSchedule, testPlan.getTitle());
    }

    @Override
    public Optional<TestPlanSchedule> findById(String id) {
        return scheduleRepository.findById(id);
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

            // Update schedule based on its type
            updateScheduleAfterExecution(schedule);

            logger.info("Successfully executed scheduled test: {}", schedule.getName());
        } catch (Exception e) {
            logger.error("Failed to execute scheduled test: {}", schedule.getName(), e);
        }
    }

    @Override
    public ResponseScheduleDTO toggleScheduleStatus(String scheduleId) {
        // Find schedule
        TestPlanSchedule schedule = findScheduleById(scheduleId);

        // Toggle status
        schedule.setEnabled(!schedule.isEnabled());

        // If enabling a recurring schedule, recalculate next run time
        if (schedule.isEnabled() && schedule.getType() == ScheduleType.RECURRING) {
            schedule.setNextRunTime(calculateNextRunTime(schedule));
        }

        // Save the updated schedule
        TestPlanSchedule savedSchedule = saveSchedule(schedule);

        // Get test plan title
        String testPlanTitle = getTestPlanTitle(savedSchedule.getTestPlanId());

        return mapToResponseScheduleDTO(savedSchedule, testPlanTitle);
    }

    @Override
    public void deleteSchedule(String scheduleId) {
        scheduleSearchRepository.deleteById(scheduleId);
        scheduleRepository.deleteById(scheduleId);
    }

    @Override
    public PaginationResponse getSchedulesByTestPlanWithPagination(String testPlanId, Pageable pageable) {
        // Validate test plan existence and get title
        String testPlanTitle = getTestPlanTitle(testPlanId);

        // Get schedules page
        Page<TestPlanSchedule> pages = scheduleRepository.findPageByTestPlanId(pageable, testPlanId);

        // Create mapper function that adds test plan title
        Function<TestPlanSchedule, ResponseScheduleDTO> mapperWithTitle =
                schedule -> {
                    ResponseScheduleDTO dto = mapper.map(schedule, ResponseScheduleDTO.class);
                    dto.setTestPlanTitle(testPlanTitle);
                    return dto;
                };

        // Create and return pagination response
        return createPaginationResponse(pages, pageable, mapperWithTitle);
    }

    @Override
    public ResponseScheduleDTO mapToResponseScheduleDTO(TestPlanSchedule testPlanSchedule, String testPlanTitle) {
        ResponseScheduleDTO dto = this.mapper.map(testPlanSchedule, ResponseScheduleDTO.class);
        dto.setTestPlanTitle(testPlanTitle);
        return dto;
    }

    @Override
    public PaginationResponse searchSchedulesByName(String testPlanId, String name, Pageable pageable) {
        // Get schedules page
        Page<TestPlanSchedule> pages = scheduleRepository.findByTestPlanIdAndNameContainingIgnoreCase(testPlanId, name, pageable);

        // Create mapper function that fetches test plan title for each schedule
        Function<TestPlanSchedule, ResponseScheduleDTO> mapperWithDynamicTitle =
                schedule -> {
                    String title = getTestPlanTitle(schedule.getTestPlanId());
                    return mapToResponseScheduleDTO(schedule, title);
                };

        // Create and return pagination response
        return createPaginationResponse(pages, pageable, mapperWithDynamicTitle);
    }

    @Override
    public PaginationResponse searchSchedulesByStatus(String testPlanId, boolean enabled, Pageable pageable) {
        // Get schedules page
        Page<TestPlanSchedule> pages = scheduleRepository.findByTestPlanIdAndEnabled(testPlanId, enabled, pageable);

        // Create mapper function that fetches test plan title for each schedule
        Function<TestPlanSchedule, ResponseScheduleDTO> mapperWithDynamicTitle =
                schedule -> {
                    String title = getTestPlanTitle(schedule.getTestPlanId());
                    return mapToResponseScheduleDTO(schedule, title);
                };

        // Create and return pagination response
        return createPaginationResponse(pages, pageable, mapperWithDynamicTitle);
    }

    @Override
    public PaginationResponse searchSchedulesByNextRunTime(String testPlanId, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        // Get schedules page
        Page<TestPlanSchedule> pages = scheduleRepository.findByTestPlanIdAndNextRunTimeBetween(testPlanId, start, end, pageable);

        // Create mapper function that fetches test plan title for each schedule
        Function<TestPlanSchedule, ResponseScheduleDTO> mapperWithDynamicTitle =
                schedule -> {
                    String title = getTestPlanTitle(schedule.getTestPlanId());
                    return mapToResponseScheduleDTO(schedule, title);
                };

        // Create and return pagination response
        return createPaginationResponse(pages, pageable, mapperWithDynamicTitle);
    }

    @Override
    public ResponseScheduleDTO editSchedule(RequestEditScheduleDTO dto) {
        logger.info("Start to edit schedule with id: {}", dto.getId());

        // Find schedule
        TestPlanSchedule schedule = findScheduleById(dto.getId());

        // Validate test plan existence
        TestPlan testPlan = validateTestPlanExists(dto.getTestPlanId());

        // Validate schedule name uniqueness
        if (!schedule.getName().equals(dto.getName())) {
            validateScheduleNameUniqueness(dto.getName(), dto.getTestPlanId(), dto.getId());
        }

        // Update basic fields
        schedule.setName(dto.getName());
        schedule.setDescription(dto.getDescription());
        schedule.setType(dto.getType());

        // Set type-specific fields
        setScheduleTypeSpecificFields(schedule, dto.getType(),
                dto.getExecutionTime(), dto.getCronExpression());

        // Save the updated schedule
        TestPlanSchedule savedSchedule = saveSchedule(schedule);

        logger.info("Edit test plan schedule successfully!");
        return mapToResponseScheduleDTO(savedSchedule, testPlan.getTitle());
    }

    // ========== HELPER METHODS ==========

    /**
     * Calculate the next run time for a schedule based on its type and configuration
     */
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

    /**
     * Create a pagination response from a page of schedules
     */
    private PaginationResponse createPaginationResponse(
            Page<TestPlanSchedule> pages,
            Pageable pageable,
            Function<TestPlanSchedule, ResponseScheduleDTO> mapper) {

        PaginationResponse response = new PaginationResponse();
        PaginationResponse.Meta meta = new PaginationResponse.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pages.getTotalPages());
        meta.setTotal(pages.getTotalElements());
        response.setMeta(meta);

        ArrayList<ResponseScheduleDTO> scheduleDTOs = new ArrayList<>(
                pages.getContent().stream()
                        .map(mapper)
                        .collect(Collectors.toList())
        );

        response.setResult(scheduleDTOs);
        return response;
    }

    /**
     * Find a schedule by ID or throw exception if not found
     */
    private TestPlanSchedule findScheduleById(String scheduleId) {
        Optional<TestPlanSchedule> scheduleOpt = findById(scheduleId);
        if (scheduleOpt.isEmpty()) {
            logger.error("Schedule not found with id: {}", scheduleId);
            throw new IllegalArgumentException("Schedule not found with id: " + scheduleId);
        }
        return scheduleOpt.get();
    }

    /**
     * Validate that a test plan exists and return it
     */
    private TestPlan validateTestPlanExists(String testPlanId) {
        Optional<TestPlan> testPlanOpt = testPlanService.findById(testPlanId);
        if (testPlanOpt.isEmpty()) {
            logger.error("Test plan not found with id: {}", testPlanId);
            throw new IllegalArgumentException("Test plan not found with id: " + testPlanId);
        }
        return testPlanOpt.get();
    }

    /**
     * Get test plan title by ID or return "Unknown" if not found
     */
    private String getTestPlanTitle(String testPlanId) {
        Optional<TestPlan> testPlanOpt = testPlanService.findById(testPlanId);
        if (testPlanOpt.isEmpty()) {
            logger.warn("Cannot find test plan with id = {}", testPlanId);
            return "Unknown";
        }
        return testPlanOpt.get().getTitle();
    }

    /**
     * Validate that a schedule name is unique for a test plan
     */
    private void validateScheduleNameUniqueness(String name, String testPlanId, String excludeId) {
        ArrayList<TestPlanSchedule> existingSchedules = scheduleRepository.findByName(name);
        for (TestPlanSchedule existingSchedule : existingSchedules) {
            // Check if schedule with same name exists for this test plan, excluding the current schedule (for edit)
            if (existingSchedule.getTestPlanId().equals(testPlanId) &&
                    (excludeId == null || !existingSchedule.getId().equals(excludeId))) {
                logger.error("Schedule name already exists for this test plan: {}", name);
                throw new IllegalArgumentException("Schedule name already exists for this test plan: " + name);
            }
        }
    }

    /**
     * Save a schedule to both repositories
     */
    private TestPlanSchedule saveSchedule(TestPlanSchedule schedule) {
        scheduleSearchRepository.save(schedule);
        return scheduleRepository.save(schedule);
    }

    /**
     * Set type-specific fields for a schedule
     */
    private void setScheduleTypeSpecificFields(
            TestPlanSchedule schedule,
            ScheduleType type,
            LocalDateTime executionTime,
            String cronExpression) {

        if (type == ScheduleType.ONCE) {
            schedule.setExecutionTime(executionTime);
            schedule.setNextRunTime(executionTime);
            schedule.setCronExpression(null);
        } else {
            schedule.setCronExpression(cronExpression);
            schedule.setExecutionTime(null);
            schedule.setNextRunTime(calculateNextRunTime(schedule));
        }
    }

    /**
     * Update a schedule after execution based on its type
     */
    private void updateScheduleAfterExecution(TestPlanSchedule schedule) {
        if (schedule.getType() == ScheduleType.ONCE) {
            schedule.setEnabled(false);
        } else {
            LocalDateTime nextRun = calculateNextRunTime(schedule);
            schedule.setNextRunTime(nextRun);
        }
        saveSchedule(schedule);
    }
}