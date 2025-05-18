package com.vn.ptit.duongvct.dto.request.testplan;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestTestPlanDTO {
    private String url;
    private int threads;
    private int iterations;
    private int throughputTimer;
    private String fileName;
}
