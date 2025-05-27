package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.testplan.testrun.TestRun;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRunSearchRepository extends ElasticsearchRepository<TestRun, String> {
}
