package com.vn.ptit.duongvct.dto.response.testplan.testrun;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import com.vn.ptit.duongvct.dto.response.testplan.testresult.TestResultDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
@Getter
@Setter
public class ResponseTestRunDetailDTO {
    private String id;
    private String title;
    private TestPlan testPlan;
    private LocalDateTime time;
    private String fileName;
    private TestResultDTO resultDTO;
    private TestResultStats stats;
}
