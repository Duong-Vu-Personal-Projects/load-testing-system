package com.vn.ptit.duongvct.dto.response.testplan;

import com.vn.ptit.duongvct.domain.testplan.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.ThreadStageGroup;
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
public class ResponseTestPlan {
    @Id
    private String id;
    @Indexed(unique = true)
    private String title;
    private LocalDateTime time;
    private String fileName;
    private ArrayList<ThreadStageGroup> threadStageGroups;
    private ArrayList<RpsThreadStageGroup> rpsThreadStageGroups;
    private ArrayList<TestResultRecord> records;
    private TestResultStats stats;
}