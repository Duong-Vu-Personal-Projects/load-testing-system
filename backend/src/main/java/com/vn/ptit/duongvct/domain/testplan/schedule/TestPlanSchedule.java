package com.vn.ptit.duongvct.domain.testplan.schedule;

import com.vn.ptit.duongvct.constant.ScheduleType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "test_plan_schedules")
@Getter
@Setter
public class TestPlanSchedule {
    @Id
    private String id;

    private String testPlanId;

    private String name;

    private ScheduleType type;

    // For ONCE type
    private LocalDateTime executionTime;

    // For RECURRING type
    private String cronExpression;

    private boolean enabled;

    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime lastRunTime;

    private LocalDateTime nextRunTime;

    private String description;
}