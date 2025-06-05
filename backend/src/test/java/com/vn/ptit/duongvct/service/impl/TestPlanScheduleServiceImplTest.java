package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.constant.ScheduleType;
import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import com.vn.ptit.duongvct.dto.request.schedule.RequestCreateScheduleDTO;
import com.vn.ptit.duongvct.dto.request.testrun.RequestTestRunDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.schedule.ResponseScheduleDTO;
import com.vn.ptit.duongvct.repository.mongo.TestPlanScheduleRepository;
import com.vn.ptit.duongvct.repository.search.TestPlanScheduleSearchRepository;
import com.vn.ptit.duongvct.service.TestPlanService;
import com.vn.ptit.duongvct.service.TestRunService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TestPlanScheduleServiceImplTest {

    @Mock
    private TestPlanScheduleSearchRepository scheduleSearchRepository;

    @Mock
    private TestPlanScheduleRepository scheduleRepository;

    @Mock
    private TestPlanService testPlanService;

    @Mock
    private TestRunService testRunService;

    @Spy
    private ModelMapper mapper = new ModelMapper();

    @InjectMocks
    private TestPlanScheduleServiceImpl testPlanScheduleService;

    private TestPlanSchedule oneTimeSchedule;
    private TestPlanSchedule recurringSchedule;
    private TestPlan testPlan;
    private RequestCreateScheduleDTO oneTimeRequest;
    private RequestCreateScheduleDTO recurringRequest;
    private List<TestPlanSchedule> schedules;
    private Pageable pageable;

    @BeforeEach
    public void setUp() {
        // Set up test plan
        testPlan = new TestPlan();
        testPlan.setId("plan-1");
        testPlan.setTitle("Test Plan 1");

        // Set up one-time schedule
        oneTimeSchedule = new TestPlanSchedule();
        oneTimeSchedule.setId("schedule-1");
        oneTimeSchedule.setTestPlanId("plan-1");
        oneTimeSchedule.setName("One-time Schedule");
        oneTimeSchedule.setType(ScheduleType.ONCE);
        oneTimeSchedule.setDescription("Execute once");
        oneTimeSchedule.setEnabled(true);
        oneTimeSchedule.setExecutionTime(LocalDateTime.now().plusHours(1));
        oneTimeSchedule.setNextRunTime(LocalDateTime.now().plusHours(1));

        // Set up recurring schedule
        recurringSchedule = new TestPlanSchedule();
        recurringSchedule.setId("schedule-2");
        recurringSchedule.setTestPlanId("plan-1");
        recurringSchedule.setName("Recurring Schedule");
        recurringSchedule.setType(ScheduleType.RECURRING);
        recurringSchedule.setDescription("Execute daily");
        recurringSchedule.setEnabled(true);
        recurringSchedule.setCronExpression("0 0 12 * * ?"); // Daily at noon
        recurringSchedule.setNextRunTime(LocalDateTime.now().plusDays(1).withHour(12).withMinute(0).withSecond(0));

        // Set up request DTOs
        oneTimeRequest = new RequestCreateScheduleDTO();
        oneTimeRequest.setTestPlanId("plan-1");
        oneTimeRequest.setName("One-time Schedule");
        oneTimeRequest.setType(ScheduleType.ONCE);
        oneTimeRequest.setDescription("Execute once");
        oneTimeRequest.setExecutionTime(LocalDateTime.now().plusHours(1));

        recurringRequest = new RequestCreateScheduleDTO();
        recurringRequest.setTestPlanId("plan-1");
        recurringRequest.setName("Recurring Schedule");
        recurringRequest.setType(ScheduleType.RECURRING);
        recurringRequest.setDescription("Execute daily");
        recurringRequest.setCronExpression("0 0 12 * * ?");

        // Create schedules list
        schedules = new ArrayList<>();
        schedules.add(oneTimeSchedule);
        schedules.add(recurringSchedule);

        // Set up pageable
        pageable = PageRequest.of(0, 10);
    }

    @Test
    public void testCreateSchedule_OneTimeSuccess() {
        // Arrange
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));
        when(scheduleRepository.findByName("One-time Schedule")).thenReturn(new ArrayList<>());
        when(scheduleRepository.save(any(TestPlanSchedule.class))).thenReturn(oneTimeSchedule);

        // Act
        ResponseScheduleDTO result = testPlanScheduleService.createSchedule(oneTimeRequest);

        // Assert
        assertNotNull(result);
        assertEquals("One-time Schedule", result.getName());
        assertEquals(ScheduleType.ONCE, result.getType());
        assertEquals("Test Plan 1", result.getTestPlanTitle());
        verify(scheduleSearchRepository).save(any(TestPlanSchedule.class));
        verify(scheduleRepository).save(any(TestPlanSchedule.class));
    }

    @Test
    public void testCreateSchedule_RecurringSuccess() {
        // Arrange
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));
        when(scheduleRepository.findByName("Recurring Schedule")).thenReturn(new ArrayList<>());
        when(scheduleRepository.save(any(TestPlanSchedule.class))).thenReturn(recurringSchedule);

        // Act
        ResponseScheduleDTO result = testPlanScheduleService.createSchedule(recurringRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Recurring Schedule", result.getName());
        assertEquals(ScheduleType.RECURRING, result.getType());
        assertEquals("0 0 12 * * ?", result.getCronExpression());
        assertEquals("Test Plan 1", result.getTestPlanTitle());
        verify(scheduleSearchRepository).save(any(TestPlanSchedule.class));
        verify(scheduleRepository).save(any(TestPlanSchedule.class));
    }

    @Test
    public void testCreateSchedule_TestPlanNotFound() {
        // Arrange
        when(testPlanService.findById("non-existent-plan")).thenReturn(Optional.empty());

        oneTimeRequest.setTestPlanId("non-existent-plan");

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testPlanScheduleService.createSchedule(oneTimeRequest)
        );
        assertEquals("Test plan not found with id: non-existent-plan", exception.getMessage());
    }

    @Test
    public void testCreateSchedule_NameAlreadyExists() {
        // Arrange
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));

        ArrayList<TestPlanSchedule> existingSchedules = new ArrayList<>();
        existingSchedules.add(oneTimeSchedule);
        when(scheduleRepository.findByName("One-time Schedule")).thenReturn(existingSchedules);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testPlanScheduleService.createSchedule(oneTimeRequest)
        );
        assertTrue(exception.getMessage().contains("Schedule name of a test plan"));
    }

    @Test
    public void testFindById_Success() {
        // Arrange
        when(scheduleRepository.findById("schedule-1")).thenReturn(Optional.of(oneTimeSchedule));

        // Act
        Optional<TestPlanSchedule> result = testPlanScheduleService.findById("schedule-1");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("One-time Schedule", result.get().getName());
    }

    @Test
    public void testGetSchedulesToRun() {
        // Arrange
        ArrayList<TestPlanSchedule> schedulesToRun = new ArrayList<>();
        schedulesToRun.add(oneTimeSchedule);
        when(scheduleRepository.findSchedulesToRun(any(LocalDateTime.class))).thenReturn(schedulesToRun);

        // Act
        ArrayList<TestPlanSchedule> result = testPlanScheduleService.getSchedulesToRun();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("One-time Schedule", result.get(0).getName());
    }

    @Test
    public void testExecuteScheduledTest_OneTime() throws Exception {
        // Act
        testPlanScheduleService.executeScheduledTest(oneTimeSchedule);

        // Assert
        verify(testRunService).runTestPlan(any(RequestTestRunDTO.class));
        verify(scheduleRepository).save(argThat(schedule ->
                !schedule.isEnabled() && // Should be disabled after execution
                        schedule.getLastRunTime() != null // Should have last run time set
        ));
        verify(scheduleSearchRepository).save(any(TestPlanSchedule.class));
    }

    @Test
    public void testExecuteScheduledTest_Recurring() throws Exception {
        // Act
        testPlanScheduleService.executeScheduledTest(recurringSchedule);

        // Assert
        verify(testRunService).runTestPlan(any(RequestTestRunDTO.class));
        verify(scheduleRepository).save(argThat(schedule ->
                schedule.isEnabled() && // Should still be enabled
                        schedule.getLastRunTime() != null && // Should have last run time set
                        schedule.getNextRunTime() != null // Should have next run time set
        ));
        verify(scheduleSearchRepository).save(any(TestPlanSchedule.class));
    }

    @Test
    public void testToggleScheduleStatus_Disable() {
        // Arrange
        when(scheduleRepository.findById("schedule-1")).thenReturn(Optional.of(oneTimeSchedule));
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));
        when(scheduleRepository.save(any(TestPlanSchedule.class))).thenAnswer(invocation -> {
            TestPlanSchedule schedule = invocation.getArgument(0);
            schedule.setEnabled(false); // Toggling enabled to false
            return schedule;
        });

        // Act
        ResponseScheduleDTO result = testPlanScheduleService.toggleScheduleStatus("schedule-1");

        // Assert
        assertNotNull(result);
        assertFalse(result.isEnabled());
        verify(scheduleRepository).save(any(TestPlanSchedule.class));
        verify(scheduleSearchRepository).save(any(TestPlanSchedule.class));
    }

    @Test
    public void testToggleScheduleStatus_Enable() {
        // Arrange
        recurringSchedule.setEnabled(false); // Start with disabled state

        when(scheduleRepository.findById("schedule-2")).thenReturn(Optional.of(recurringSchedule));
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));
        when(scheduleRepository.save(any(TestPlanSchedule.class))).thenAnswer(invocation -> {
            TestPlanSchedule schedule = invocation.getArgument(0);
            schedule.setEnabled(true); // Toggling enabled to true
            return schedule;
        });

        // Act
        ResponseScheduleDTO result = testPlanScheduleService.toggleScheduleStatus("schedule-2");

        // Assert
        assertNotNull(result);
        assertTrue(result.isEnabled());
        verify(scheduleRepository).save(any(TestPlanSchedule.class));
        verify(scheduleSearchRepository).save(any(TestPlanSchedule.class));
    }

    @Test
    public void testToggleScheduleStatus_NotFound() {
        // Arrange
        when(scheduleRepository.findById("invalid-id")).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testPlanScheduleService.toggleScheduleStatus("invalid-id")
        );
        assertEquals("Schedule not found with id: invalid-id", exception.getMessage());
    }

    @Test
    public void testDeleteSchedule() {
        // Act
        testPlanScheduleService.deleteSchedule("schedule-1");

        // Assert
        verify(scheduleSearchRepository).deleteById("schedule-1");
        verify(scheduleRepository).deleteById("schedule-1");
    }

    @Test
    public void testGetSchedulesByTestPlanWithPagination() {
        // Arrange
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));

        Page<TestPlanSchedule> page = new PageImpl<>(schedules, pageable, schedules.size());
        when(scheduleRepository.findPageByTestPlanId(pageable, "plan-1")).thenReturn(page);

        // Act
        PaginationResponse result = testPlanScheduleService.getSchedulesByTestPlanWithPagination("plan-1", pageable);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getMeta());
        assertEquals(1, result.getMeta().getPage());
        assertEquals(10, result.getMeta().getPageSize());
        assertEquals(2, result.getMeta().getTotal());

        List<?> resultList = (List<?>) result.getResult();
        assertEquals(2, resultList.size());
    }

    @Test
    public void testGetSchedulesByTestPlanWithPagination_TestPlanNotFound() {
        // Arrange
        when(testPlanService.findById("invalid-id")).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> testPlanScheduleService.getSchedulesByTestPlanWithPagination("invalid-id", pageable)
        );
        assertEquals("Test plan not found with id: invalid-id", exception.getMessage());
    }

    @Test
    public void testSearchSchedulesByName() {
        // Arrange
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));

        List<TestPlanSchedule> filteredSchedules = new ArrayList<>();
        filteredSchedules.add(oneTimeSchedule);

        Page<TestPlanSchedule> page = new PageImpl<>(filteredSchedules, pageable, filteredSchedules.size());
        when(scheduleRepository.findByTestPlanIdAndNameContainingIgnoreCase("plan-1", "One", pageable)).thenReturn(page);

        // Act
        PaginationResponse result = testPlanScheduleService.searchSchedulesByName("plan-1", "One", pageable);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getMeta());
        assertEquals(1, result.getMeta().getTotal());

        List<?> resultList = (List<?>) result.getResult();
        assertEquals(1, resultList.size());
    }

    @Test
    public void testSearchSchedulesByStatus() {
        // Arrange
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));

        Page<TestPlanSchedule> page = new PageImpl<>(schedules, pageable, schedules.size());
        when(scheduleRepository.findByTestPlanIdAndEnabled("plan-1", true, pageable)).thenReturn(page);

        // Act
        PaginationResponse result = testPlanScheduleService.searchSchedulesByStatus("plan-1", true, pageable);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getMeta());
        assertEquals(2, result.getMeta().getTotal());

        List<?> resultList = (List<?>) result.getResult();
        assertEquals(2, resultList.size());
    }

    @Test
    public void testSearchSchedulesByNextRunTime() {
        // Arrange
        when(testPlanService.findById("plan-1")).thenReturn(Optional.of(testPlan));

        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = LocalDateTime.now().plusDays(2);

        Page<TestPlanSchedule> page = new PageImpl<>(schedules, pageable, schedules.size());
        when(scheduleRepository.findByTestPlanIdAndNextRunTimeBetween("plan-1", start, end, pageable)).thenReturn(page);

        // Act
        PaginationResponse result = testPlanScheduleService.searchSchedulesByNextRunTime("plan-1", start, end, pageable);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getMeta());
        assertEquals(2, result.getMeta().getTotal());

        List<?> resultList = (List<?>) result.getResult();
        assertEquals(2, resultList.size());
    }

    @Test
    public void testMapToResponseScheduleDTO() {
        // Act
        ResponseScheduleDTO result = testPlanScheduleService.mapToResponseScheduleDTO(oneTimeSchedule, "Test Plan 1");

        // Assert
        assertNotNull(result);
        assertEquals("One-time Schedule", result.getName());
        assertEquals("Test Plan 1", result.getTestPlanTitle());
        assertEquals(ScheduleType.ONCE, result.getType());
    }
}