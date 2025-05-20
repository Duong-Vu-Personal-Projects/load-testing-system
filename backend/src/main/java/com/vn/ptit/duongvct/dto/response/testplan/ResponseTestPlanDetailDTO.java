package com.vn.ptit.duongvct.dto.response.testplan;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import com.vn.ptit.duongvct.dto.response.testplan.testresult.TestResultDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
@Getter
@Setter
public class ResponseTestPlanDetailDTO {
    private String id;
    private String title;
    private LocalDateTime time;
    private String fileName;
    private ArrayList<ThreadStageGroup> threadStageGroups;
    private ArrayList<RpsThreadStageGroup> rpsThreadStageGroups;
    private TestResultDTO resultDTO;
    private TestResultStats stats;
}
