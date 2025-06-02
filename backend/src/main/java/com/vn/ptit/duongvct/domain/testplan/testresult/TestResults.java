package com.vn.ptit.duongvct.domain.testplan.testresult;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
@org.springframework.data.elasticsearch.annotations.Document(indexName = "test_results")
@Document(value = "test_results")
@Getter
@Setter
public class TestResults {
    @Id
    String id;
    private ArrayList<TestResultRecord> records;
}
