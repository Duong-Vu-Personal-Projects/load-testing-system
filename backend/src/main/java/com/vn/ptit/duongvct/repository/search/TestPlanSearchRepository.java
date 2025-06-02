package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestPlanSearchRepository extends ElasticsearchRepository<TestPlan, String> {
    @Query("{\"match_phrase_prefix\": {\"title\": \"?0\"}}")
    Page<TestPlan> findByTitleCustom(String title, Pageable pageable);
}
