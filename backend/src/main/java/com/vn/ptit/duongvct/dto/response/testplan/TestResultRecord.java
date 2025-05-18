package com.vn.ptit.duongvct.dto.response.testplan;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestResultRecord {
    long timeStamp;
    long elapsed ;
    String label ;
    int responseCode;
    String responseMessage;
    String threadName;
    String dataType;
    boolean success;
    String failureMessage;
    long bytes;
    long sentBytes;
    int grpThreads;
    int allThreads;
    String URL;
    long latency;
    long idleTime;
    long connect;

}
