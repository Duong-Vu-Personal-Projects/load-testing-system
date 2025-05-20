package com.vn.ptit.duongvct.domain.testplan.threadstagegroup;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseThreadGroup {
    protected String url;
    protected boolean isFollowRedirects;
    protected int rampDuration;
    protected int holdDuration;
    protected int rampToThreads;
    protected int throughputTimer;
}
