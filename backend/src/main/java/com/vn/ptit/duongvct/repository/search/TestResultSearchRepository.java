package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.testplan.testresult.TestResults;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestResultSearchRepository extends ElasticsearchRepository<TestResults, String> {
}
