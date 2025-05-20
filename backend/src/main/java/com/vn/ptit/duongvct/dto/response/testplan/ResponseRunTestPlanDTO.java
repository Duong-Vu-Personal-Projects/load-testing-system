package com.vn.ptit.duongvct.dto.response.testplan;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResponseRunTestPlanDTO {
    private String id;
    private String title;
    private LocalDateTime time;
    private String fileName;
    private TestResultStats stats;
}