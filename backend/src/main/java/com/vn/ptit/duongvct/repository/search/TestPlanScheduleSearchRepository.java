package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestPlanScheduleSearchRepository extends ElasticsearchRepository<TestPlanSchedule, String> {
}
