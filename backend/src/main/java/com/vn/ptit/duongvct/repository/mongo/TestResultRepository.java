package com.vn.ptit.duongvct.repository.mongo;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestResultRepository extends MongoRepository<TestResults, String> {
}
