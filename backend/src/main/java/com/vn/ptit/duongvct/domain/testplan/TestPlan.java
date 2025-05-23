package com.vn.ptit.duongvct.domain.testplan;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultRecord;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Document(collection = "test_plans")
@Getter
@Setter
public class TestPlan {
    @Id
    private String id;
    @Indexed(unique = true)
    private String title;
    private ArrayList<ThreadStageGroup> threadStageGroups;
    private ArrayList<RpsThreadStageGroup> rpsThreadStageGroups;
}