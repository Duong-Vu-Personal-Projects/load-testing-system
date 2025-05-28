package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TestRunSearchRepository extends ElasticsearchRepository<TestRun, String> {
    Page<TestRun> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // Search by test plan ID
    Page<TestRun> findByTestPlanId(String testPlanId, Pageable pageable);

    // Search by date range
    Page<TestRun> findByTimeBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    // Search by error rate (for finding problematic test runs)
    @Query("{\"range\": {\"stats.errorRate\": {\"gt\": ?0}}}")
    Page<TestRun> findByErrorRateGreaterThan(double errorRate, Pageable pageable);
}
