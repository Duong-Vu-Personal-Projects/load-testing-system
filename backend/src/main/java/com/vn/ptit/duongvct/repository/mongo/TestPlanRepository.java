package com.vn.ptit.duongvct.repository.mongo;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestPlanRepository extends MongoRepository<TestPlan, String> {
    boolean existsByTitle(String title);
}
