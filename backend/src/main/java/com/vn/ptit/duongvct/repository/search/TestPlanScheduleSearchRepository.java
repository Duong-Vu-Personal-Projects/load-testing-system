package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface TestPlanScheduleSearchRepository extends ElasticsearchRepository<TestPlanSchedule, String> {
}
