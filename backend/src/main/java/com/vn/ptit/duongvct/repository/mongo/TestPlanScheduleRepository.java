package com.vn.ptit.duongvct.repository.mongo;

import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Repository
public interface TestPlanScheduleRepository extends MongoRepository<TestPlanSchedule, String> {
    ArrayList<TestPlanSchedule> findByTestPlanId(String testPlanId);

    @Query("{'enabled': true, 'nextRunTime': {$lte: ?0}}")
    ArrayList<TestPlanSchedule> findSchedulesToRun(LocalDateTime currentTime);
    Page<TestPlanSchedule> findPageByTestPlanId(Pageable pageable, String testPlanId);
    ArrayList<TestPlanSchedule> findByEnabledTrue();

    boolean existsByName(String name);
}
