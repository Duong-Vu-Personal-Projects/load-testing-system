package com.vn.ptit.duongvct.util.jmeter;

import kg.apc.jmeter.perfmon.PerfMonCollector;
import kg.apc.jmeter.vizualizers.PerfMonGui;
import org.apache.jmeter.samplers.SampleSaveConfiguration;
import org.apache.jmeter.testelement.TestElement;
import us.abstracta.jmeter.javadsl.core.listeners.BaseListener;

public class DslPerfMonCollector extends BaseListener {

    private String serverUrl;
    private String metric;
    private long samplingInterval = 1000;
    private String filename;

    public DslPerfMonCollector(String name) {
        super(name, null);
    }

    public DslPerfMonCollector serverUrl(String serverUrl) {
        this.serverUrl = serverUrl;
        return this;
    }

    public DslPerfMonCollector metric(String metric) {
        this.metric = metric;
        return this;
    }

    public DslPerfMonCollector samplingInterval(long intervalMillis) {
        this.samplingInterval = intervalMillis;
        return this;
    }

    public DslPerfMonCollector filename(String filename) {
        this.filename = filename;
        return this;
    }

    @Override
    protected TestElement buildTestElement() {
        PerfMonCollector collector = new PerfMonCollector();

        // Set required properties
        collector.setProperty("serverUrl", serverUrl);
        long interval = samplingInterval;
        collector.setProperty("samplingInterval", Long.toString(interval));
        collector.setProperty("metricType", metric);

        // Set filename if provided
        if (filename != null) {
            collector.setFilename(filename);
        }

        // Configure save settings
        SampleSaveConfiguration saveConfig = new SampleSaveConfiguration();
        saveConfig.setTime(true);
        saveConfig.setLatency(true);
        saveConfig.setTimestamp(true);
        saveConfig.setSuccess(true);
        saveConfig.setLabel(true);
        saveConfig.setCode(true);
        saveConfig.setMessage(true);
        saveConfig.setThreadName(true);
        collector.setSaveConfig(saveConfig);

        return collector;
    }

    public static DslPerfMonCollector perfMonCollector(String name) {
        return new DslPerfMonCollector(name);
    }
}