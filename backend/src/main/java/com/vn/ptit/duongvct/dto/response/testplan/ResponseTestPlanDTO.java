package com.vn.ptit.duongvct.dto.response.testplan;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.ArrayList;

@Document(indexName = "result_tests")
@Getter
@Setter
public class ResponseTestPlanDTO {
    @Id
    private String id;
    private String url;
    private String fileName;
    private int threads;
    private int iterations;
    private int throughputTimer;
    private ArrayList<TestResultRecord> records;
    private TestResultStats stats;
}