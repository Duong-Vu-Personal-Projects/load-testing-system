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
    Page<TestRun> findByTestPlanId(String testPlanId, Pageable pageable);
}
