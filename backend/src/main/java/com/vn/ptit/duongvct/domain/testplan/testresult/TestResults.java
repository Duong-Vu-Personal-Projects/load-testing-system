package com.vn.ptit.duongvct.domain.testplan.testresult;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document(value = "test_results")
@Getter
@Setter
public class TestResults {
    @Id
    String id;
    private ArrayList<TestResultRecord> records;
}
