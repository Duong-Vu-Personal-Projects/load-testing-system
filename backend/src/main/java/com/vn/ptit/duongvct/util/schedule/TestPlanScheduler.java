package com.vn.ptit.duongvct.util.schedule;

import com.vn.ptit.duongvct.domain.testplan.schedule.TestPlanSchedule;
import com.vn.ptit.duongvct.service.TestPlanScheduleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.ArrayList;

@Component
public class TestPlanScheduler {
    private static final Logger logger = LoggerFactory.getLogger(TestPlanScheduler.class);

    private final TestPlanScheduleService scheduleService;

    public TestPlanScheduler(TestPlanScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    /**
     * This method runs every minute to check for scheduled tests that need to be executed
     */
    @Scheduled(cron = "0 * * * * *") // Run every minute
    public void executeScheduledTests() {
        try {
            // Get all schedules that are due to run
            ArrayList<TestPlanSchedule> schedulesToRun = scheduleService.getSchedulesToRun();

            if (!schedulesToRun.isEmpty()) {
                logger.info("Found {} scheduled tests to execute", schedulesToRun.size());

                for (TestPlanSchedule schedule : schedulesToRun) {
                    scheduleService.executeScheduledTest(schedule);
                }
            }
        } catch (Exception e) {
            logger.error("Error in scheduled test execution", e);
        }
    }
}
