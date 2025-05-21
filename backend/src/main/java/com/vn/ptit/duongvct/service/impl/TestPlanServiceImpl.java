package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTableTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlanDTO;
import com.vn.ptit.duongvct.repository.mongo.TestPlanRepository;
import com.vn.ptit.duongvct.service.TestPlanService;
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
    private final ModelMapper mapper;
    public TestPlanServiceImpl(TestPlanRepository testPlanRepository, ModelMapper modelMapper) {
        this.testPlanRepository = testPlanRepository;
        this.mapper = modelMapper;
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
        return this.testPlanRepository.save(testPlan);
    }

    @Override
    public void deleteTestPlanById(String id) {
        Optional<TestPlan> testPlan = this.testPlanRepository.findById(id);
        if (testPlan.isEmpty()) {
            throw new NoSuchElementException("Cannot find test plan with id = " + id);
        }
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
}
