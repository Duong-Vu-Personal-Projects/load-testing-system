package com.vn.ptit.duongvct.domain.testplan.testrun;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResultStats;
import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Document(collection = "test_runs")
@Getter
@Setter
public class TestRun {
    @Id
    private String id;
    @Indexed(unique = true)
    private String title;
    private TestPlan testPlan;
    private LocalDateTime time;
    private String fileName;
    private TestResults results;
    private TestResultStats stats;
}
