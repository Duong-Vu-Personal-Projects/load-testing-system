package com.vn.ptit.duongvct.dto.request.testplan;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RequestTestPlanDTO {
    private String url;
    private String title;
    private int threads;
    private int iterations;
    private int throughputTimer;
    private String fileName;
    private LocalDateTime time;
}
