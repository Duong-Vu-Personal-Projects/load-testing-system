package com.vn.ptit.duongvct.dto.request.schedule;

import com.vn.ptit.duongvct.constant.ScheduleType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RequestCreateScheduleDTO {
    private String testPlanId;
    private String name;
    private ScheduleType type;
    private LocalDateTime executionTime; // For ONCE type
    private String cronExpression; // For RECURRING type
    private String description;
}
