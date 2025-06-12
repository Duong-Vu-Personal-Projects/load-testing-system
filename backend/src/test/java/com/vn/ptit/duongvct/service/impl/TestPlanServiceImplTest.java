package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTableTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;
import com.vn.ptit.duongvct.repository.mongo.TestPlanRepository;
import com.vn.ptit.duongvct.repository.search.TestPlanSearchRepository;
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

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TestPlanServiceImplTest {
    @Mock
    private TestPlanRepository testPlanRepository;
    
    @Mock
    private TestRunService testRunService;
    
    @Spy
    private ModelMapper mapper = new ModelMapper();
    
    @Mock
    private TestPlanSearchRepository testPlanSearchRepository;
    
    @InjectMocks
    private TestPlanServiceImpl testPlanService;
    
    private TestPlan testPlan;
    private RequestTestPlanDTO requestTestPlanDTO;
    private List<TestPlan> testPlans;
    
    @BeforeEach
    public void setUp() {
        // Initialize test data
        testPlan = new TestPlan();
        testPlan.setId("plan-1");
        testPlan.setTitle("Test Plan 1");
        
        requestTestPlanDTO = new RequestTestPlanDTO();
        requestTestPlanDTO.setTitle("Test Plan 1");
        
        testPlans = Arrays.asList(testPlan);
    }
    
    @Test
    public void testCreateTestPlan() {
        // Arrange
        when(testPlanRepository.existsByTitle(anyString())).thenReturn(false);
        when(testPlanRepository.save(any(TestPlan.class))).thenReturn(testPlan);
        
        // Act
        TestPlan result = testPlanService.createTestPlan(testPlan);
        
        // Assert
        assertNotNull(result);
        assertEquals("Test Plan 1", result.getTitle());
        verify(testPlanSearchRepository).save(testPlan);
        verify(testPlanRepository).save(testPlan);
    }
    
    @Test
    public void testCreateTestPlanWithExistingTitle() {
        // Arrange
        when(testPlanRepository.existsByTitle("Test Plan 1")).thenReturn(true);
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> testPlanService.createTestPlan(testPlan)
        );
        assertEquals("Title is already exists. Please choose another title name", exception.getMessage());
    }
    
    @Test
    public void testFindById() {
        // Arrange
        when(testPlanRepository.findById("plan-1")).thenReturn(Optional.of(testPlan));
        
        // Act
        Optional<TestPlan> result = testPlanService.findById("plan-1");
        
        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Plan 1", result.get().getTitle());
    }
    
    @Test
    public void testEditTestPlan() {
        // Arrange
        when(testPlanRepository.findById("plan-1")).thenReturn(Optional.of(testPlan));
        when(testPlanRepository.save(any(TestPlan.class))).thenReturn(testPlan);
        
        TestPlan updatedPlan = new TestPlan();
        updatedPlan.setId("plan-1");
        updatedPlan.setTitle("Updated Test Plan");
        
        // Act
        TestPlan result = testPlanService.editTestPlan(updatedPlan);
        
        // Assert
        assertNotNull(result);
        verify(testPlanSearchRepository).save(updatedPlan);
        verify(testPlanRepository).save(updatedPlan);
    }
    
    @Test
    public void testEditTestPlanNotFound() {
        // Arrange
        when(testPlanRepository.findById("invalid-id")).thenReturn(Optional.empty());
        
        TestPlan invalidPlan = new TestPlan();
        invalidPlan.setId("invalid-id");
        
        // Act & Assert
        NoSuchElementException exception = assertThrows(
            NoSuchElementException.class,
            () -> testPlanService.editTestPlan(invalidPlan)
        );
        assertEquals("Cannot find test plan with id = invalid-id", exception.getMessage());
    }
    
    @Test
    public void testDeleteTestPlanById() {
        // Arrange
        when(testPlanRepository.findById("plan-1")).thenReturn(Optional.of(testPlan));
        when(testRunService.getAllTestRunOfATestPlan("plan-1")).thenReturn(new ArrayList<>());
        
        // Act
        testPlanService.deleteTestPlanById("plan-1");
        
        // Assert
        verify(testPlanSearchRepository).deleteById("plan-1");
        verify(testPlanRepository).deleteById("plan-1");
    }
    
    @Test
    public void testDeleteTestPlanWithTestRuns() {
        // Arrange
        when(testPlanRepository.findById("plan-1")).thenReturn(Optional.of(testPlan));
        
        TestRun testRun = new TestRun();
        testRun.setId("run-1");
        ArrayList<TestRun> testRuns = new ArrayList<>();
        testRuns.add(testRun);
        
        when(testRunService.getAllTestRunOfATestPlan("plan-1")).thenReturn(testRuns);
        
        // Act
        testPlanService.deleteTestPlanById("plan-1");
        
        // Assert
        verify(testRunService).deleteTestRun(testRun);
        verify(testPlanSearchRepository).deleteById("plan-1");
        verify(testPlanRepository).deleteById("plan-1");
    }
    
    @Test
    public void testMapRequestTestPlan() {
        // Act
        TestPlan result = testPlanService.mapRequestTestPlan(requestTestPlanDTO);
        
        // Assert
        assertNotNull(result);
        assertEquals("Test Plan 1", result.getTitle());
    }
    
    @Test
    public void testMapTestPlan() {
        // Act
        ResponseTestPlanDTO result = testPlanService.mapTestPlan(testPlan);
        
        // Assert
        assertNotNull(result);
        assertEquals("plan-1", result.getId());
        assertEquals("Test Plan 1", result.getTitle());
    }
    
    @Test
    public void testGetAllTestPlan() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestPlan> page = new PageImpl<>(testPlans, pageable, testPlans.size());
        
        when(testPlanRepository.findAll(pageable)).thenReturn(page);
        
        // Act
        PaginationResponse result = testPlanService.getAllTestPlan(pageable);
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.getMeta().getTotal());
        assertNotNull(result.getResult());
        
        List<ResponseTableTestPlanDTO> plans = (List<ResponseTableTestPlanDTO>) result.getResult();
        assertEquals(1, plans.size());
        assertEquals("plan-1", plans.get(0).getId());
    }
    
    @Test
    public void testSearchTestPlans() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<TestPlan> page = new PageImpl<>(testPlans, pageable, testPlans.size());
        
        when(testPlanSearchRepository.findByTitleCustom("test", pageable)).thenReturn(page);
        
        // Act
        PaginationResponse result = testPlanService.searchTestPlans("test", pageable);
        
        // Assert
        assertNotNull(result);
        assertEquals(1, result.getMeta().getTotal());
        assertNotNull(result.getResult());
        
        List<ResponseTableTestPlanDTO> plans = (List<ResponseTableTestPlanDTO>) result.getResult();
        assertEquals(1, plans.size());
    }
}