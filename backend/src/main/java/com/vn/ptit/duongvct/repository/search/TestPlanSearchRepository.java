package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestPlanSearchRepository extends ElasticsearchRepository<TestPlan, String> {

}
