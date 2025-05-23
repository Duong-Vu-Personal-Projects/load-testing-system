package com.vn.ptit.duongvct.dto.response.testplan.testrun;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResponseTableTestRunDTO {
    private String id;
    private String title;
    private LocalDateTime time;
}
