package com.vn.ptit.duongvct.domain.testplan;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.RpsThreadStageGroup;
import com.vn.ptit.duongvct.domain.testplan.threadstagegroup.ThreadStageGroup;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
@org.springframework.data.elasticsearch.annotations.Document(indexName = "test_plans")
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
    private AutoStopConfig globalAutoStop;
}