package com.vn.ptit.duongvct.dto.response.testplan;

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
    private String url;
    @Indexed(unique = true)
    private String title;
    private LocalDateTime time;
    private String fileName;
    private int threads;
    private int iterations;
    private int throughputTimer;
    private ArrayList<TestResultRecord> records;
    private TestResultStats stats;
}