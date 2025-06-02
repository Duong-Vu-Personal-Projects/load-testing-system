package com.vn.ptit.duongvct.dto.request.schedule;

import com.vn.ptit.duongvct.constant.ScheduleType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RequestCreateScheduleDTO {
    @NotBlank
    private String testPlanId;
    @NotBlank
    private String name;
    @NotNull
    private ScheduleType type;
    @Future(message = "Execution time must be in the future")
    private LocalDateTime executionTime; // For ONCE type
    @Pattern(
            regexp = "^([0-5]?\\d\\s+){4}([0-5]?\\d|\\*)$",
            message = "Invalid cron expression"
    )
    private String cronExpression; // For RECURRING type
    private String description;
}
