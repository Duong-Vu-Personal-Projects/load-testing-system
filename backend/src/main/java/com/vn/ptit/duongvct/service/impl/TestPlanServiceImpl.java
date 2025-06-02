package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTableTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;
import com.vn.ptit.duongvct.repository.mongo.TestPlanRepository;
import com.vn.ptit.duongvct.repository.search.TestPlanSearchRepository;
import com.vn.ptit.duongvct.service.TestPlanService;
import com.vn.ptit.duongvct.service.TestRunService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class TestPlanServiceImpl implements TestPlanService {
    private final TestPlanRepository testPlanRepository;
    private final TestRunService testRunService;
    private final ModelMapper mapper;
    private final TestPlanSearchRepository testPlanSearchRepository;
    public TestPlanServiceImpl(TestPlanRepository testPlanRepository, TestRunService testRunService, ModelMapper modelMapper, TestPlanSearchRepository testPlanSearchRepository) {
        this.testPlanRepository = testPlanRepository;
        this.testRunService = testRunService;
        this.mapper = modelMapper;
        this.testPlanSearchRepository = testPlanSearchRepository;
    }

    @Override
    public Optional<TestPlan> findById(String id) {
        return this.testPlanRepository.findById(id);
    }

    @Override
    public TestPlan editTestPlan(TestPlan testPlan) {
        Optional<TestPlan> foundedTestPlan = this.testPlanRepository.findById(testPlan.getId());
        if (foundedTestPlan.isEmpty()) {
            throw new NoSuchElementException("Cannot find test plan with id = " + testPlan.getId());
        }
        this.testPlanSearchRepository.save(testPlan);
        return this.testPlanRepository.save(testPlan);
    }

    @Override
    public void deleteTestPlanById(String id) {
        Optional<TestPlan> testPlan = this.testPlanRepository.findById(id);
        if (testPlan.isEmpty()) {
            throw new NoSuchElementException("Cannot find test plan with id = " + id);
        }
        ArrayList<TestRun> testRuns = this.testRunService.getAllTestRunOfATestPlan(id);
        for (TestRun testRun : testRuns) {
            this.testRunService.deleteTestRun(testRun);
        }
        this.testPlanSearchRepository.deleteById(id);
        this.testPlanRepository.deleteById(id);
    }

    @Override
    public TestPlan mapRequestTestPlan(RequestTestPlanDTO dto) {
        return this.mapper.map(dto, TestPlan.class);
    }

    @Override
    public ResponseTestPlanDTO mapTestPlan(TestPlan testPlan) {
        return this.mapper.map(testPlan, ResponseTestPlanDTO.class);
    }

    @Override
    public TestPlan createTestPlan(TestPlan testPlan) {
        if (this.testPlanRepository.existsByTitle(testPlan.getTitle())) {
            throw new IllegalArgumentException("Title is already exists. Please choose another title name");
        }
        this.testPlanSearchRepository.save(testPlan);
        return this.testPlanRepository.save(testPlan);
    }
    @Override
    public PaginationResponse getAllTestPlan(Pageable pageable) {
        Page<TestPlan> pages = this.testPlanRepository.findAll(pageable);
        PaginationResponse res = setPaginationResponse(pageable, pages);
        ArrayList<ResponseTableTestPlanDTO> list = new ArrayList<>(pages.getContent().stream().map(
                testPlan -> this.mapper.map(testPlan, ResponseTableTestPlanDTO.class)
        ).toList());
        res.setResult(list);
        return res;
    }
    @Override
    public PaginationResponse setPaginationResponse (Pageable pageable, Page<TestPlan> pageTestPlan) {
        PaginationResponse result = new PaginationResponse();
        PaginationResponse.Meta meta = new PaginationResponse.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageTestPlan.getTotalPages());
        meta.setTotal(pageTestPlan.getTotalElements());
        result.setMeta(meta);
        return result;
    }

    @Override
    public PaginationResponse searchTestPlans(String keyword, Pageable pageable) {
        Page<TestPlan> pages = this.testPlanSearchRepository.findByTitleCustom(keyword, pageable);
        PaginationResponse res = setPaginationResponse(pageable, pages);
        ArrayList<ResponseTableTestPlanDTO> list = new ArrayList<>(pages.getContent().stream().map(
                testPlan -> this.mapper.map(testPlan, ResponseTableTestPlanDTO.class)
        ).toList());
        res.setResult(list);
        return res;
    }
}
