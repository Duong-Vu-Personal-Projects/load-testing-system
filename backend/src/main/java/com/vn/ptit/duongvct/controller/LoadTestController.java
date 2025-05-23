package com.vn.ptit.duongvct.controller;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.dto.request.testplan.RequestTestPlanDTO;
import com.vn.ptit.duongvct.dto.response.PaginationResponse;
import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseRunTestPlanDTO;

import com.vn.ptit.duongvct.dto.response.testplan.testrun.ResponseTestRunDetailDTO;
import com.vn.ptit.duongvct.service.TestPlanService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/load-test")
public class LoadTestController {

}