package com.vn.ptit.duongvct.repository.mongo;

import com.vn.ptit.duongvct.dto.response.testplan.ResponseTestPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestPlanRepository extends MongoRepository<ResponseTestPlan, String> {
    boolean existsByTitle(String title);
}
