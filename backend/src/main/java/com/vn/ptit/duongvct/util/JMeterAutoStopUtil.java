package com.vn.ptit.duongvct.util;

import com.vn.ptit.duongvct.domain.testplan.AutoStopConfig;
import com.vn.ptit.duongvct.domain.testplan.TestPlan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import us.abstracta.jmeter.javadsl.core.DslTestPlan;
import us.abstracta.jmeter.javadsl.core.listeners.AutoStopListener;


import java.util.ArrayList;
import java.util.List;

/**
 * Utility class for handling JMeter auto-stop configurations.
 */
public class JMeterAutoStopUtil {
    private static final Logger logger = LoggerFactory.getLogger(JMeterAutoStopUtil.class);

    /**
     * Applies auto-stop configurations to a JMeter test plan.
     *
     * @param dslTestPlan The JMeter DSL test plan
     * @param testPlan The domain test plan with auto-stop configurations
     */
    public static void applyAutoStopConfigurations(DslTestPlan dslTestPlan, TestPlan testPlan) {
        List<AutoStopListener> autoStopListeners = new ArrayList<>();

        // First, check if there's a global auto-stop
        if (testPlan.getGlobalAutoStop() != null && testPlan.getGlobalAutoStop().isEnabled()) {
            Object element = testPlan.getGlobalAutoStop().toDslElement();
            if (element != null && element instanceof AutoStopListener) {
                dslTestPlan.children((AutoStopListener)element);
                logger.info("Added global auto-stop configuration");
            }
        }

        // Then check for thread group auto-stops
        if (testPlan.getThreadStageGroups() != null) {
            for (int i = 0; i < testPlan.getThreadStageGroups().size(); i++) {
                AutoStopConfig autoStop = testPlan.getThreadStageGroups().get(i).getAutoStop();
                if (autoStop != null && autoStop.isEnabled()) {
                    // Set a name if not already set
                    if (autoStop.getName() == null || autoStop.getName().isEmpty()) {
                        autoStop.setName("Thread Group " + (i + 1) + " Auto-Stop");
                    }

                    Object element = autoStop.toDslElement();
                    if (element != null && element instanceof AutoStopListener) {
                        dslTestPlan.children((AutoStopListener)element);
                        logger.info("Added auto-stop configuration for thread group {}", i + 1);
                    }
                }
            }
        }

        // Finally check for RPS thread group auto-stops
        if (testPlan.getRpsThreadStageGroups() != null) {
            for (int i = 0; i < testPlan.getRpsThreadStageGroups().size(); i++) {
                AutoStopConfig autoStop = testPlan.getRpsThreadStageGroups().get(i).getAutoStop();
                if (autoStop != null && autoStop.isEnabled()) {
                    // Set a name if not already set
                    if (autoStop.getName() == null || autoStop.getName().isEmpty()) {
                        autoStop.setName("RPS Thread Group " + (i + 1) + " Auto-Stop");
                    }

                    Object element = autoStop.toDslElement();
                    if (element != null && element instanceof AutoStopListener) {
                        dslTestPlan.children((AutoStopListener)element);
                        logger.info("Added auto-stop configuration for RPS thread group {}", i + 1);
                    }
                }
            }
        }

        logger.info("Applied auto-stop configurations");
    }
}