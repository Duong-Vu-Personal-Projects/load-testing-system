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
    ArrayList<TestPlanSchedule> findByName(String name);
    @Query("{'testPlanId': ?0, 'name': {$regex: ?1, $options: 'i'}}")
    Page<TestPlanSchedule> findByTestPlanIdAndNameContainingIgnoreCase(String testPlanId, String name, Pageable pageable);
    Page<TestPlanSchedule> findByTestPlanIdAndEnabled(String testPlanId, boolean enabled, Pageable pageable);
    Page<TestPlanSchedule> findByTestPlanIdAndNextRunTimeBetween(String testPlanId, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
