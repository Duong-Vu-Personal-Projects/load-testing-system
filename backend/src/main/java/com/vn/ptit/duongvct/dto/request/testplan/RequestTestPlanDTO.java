package com.vn.ptit.duongvct.dto.request.testplan;

import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class RequestTestPlanDTO {
    private String title;
    private ArrayList<ThreadStageGroup> threadStageGroups;
    private ArrayList<RpsThreadStageGroup> rpsThreadStageGroups;
}
