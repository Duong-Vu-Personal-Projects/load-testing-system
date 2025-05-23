package com.vn.ptit.duongvct.dto.response.testplan;

import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class ResponseTestPlanDTO {
    private String id;
    private String title;
}
