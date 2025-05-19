package com.vn.ptit.duongvct.util.jmeter;

public class PerfMonJmeterDsl {

    public static DslPerfMonCollector perfMonCollector(String name) {
        return new DslPerfMonCollector(name);
    }
}