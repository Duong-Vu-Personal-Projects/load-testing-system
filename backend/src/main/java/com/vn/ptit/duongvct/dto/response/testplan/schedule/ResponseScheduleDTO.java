package com.vn.ptit.duongvct.dto.response.testplan.schedule;

import com.vn.ptit.duongvct.constant.ScheduleType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResponseScheduleDTO {
    private String id;
    private String testPlanId;
    private String testPlanTitle; // Added for convenience
    private String name;
    private ScheduleType type;
    private LocalDateTime executionTime;
    private String cronExpression;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastRunTime;
    private LocalDateTime nextRunTime;
    private String description;
}
