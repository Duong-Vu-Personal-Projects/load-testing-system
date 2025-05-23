package com.vn.ptit.duongvct.repository.mongo;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface TestRunRepository extends MongoRepository<TestRun, String> {
    boolean existsByTitle(String title);
    ArrayList<TestRun> findByTestPlanId(String testPlanId);
    long countByTestPlanId(String testPlanId);
    @Query("{'testPlan.id': ?0}")
    Page<TestRun> findPagesByTestPlanId(Pageable pageable, String testPlanId);
}
