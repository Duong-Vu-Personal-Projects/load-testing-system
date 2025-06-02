import {Card, Descriptions, Tag} from "antd";
import type {ITestResultDetail} from "../../create-test-plan/type.test.plan.tsx";
import React from "react";
import Title from "antd/es/typography/Title";
import dayjs from 'dayjs'; 
interface ITestInfoPanelProps {
    testData: ITestResultDetail;
}
const TestInfoPanel: React.FC<ITestInfoPanelProps> = (props: ITestInfoPanelProps) => {
    const {testData} = props;
    return (
        <Card>
            <Title level={2}>
                Test Results: {testData.title}
                <Tag
                    color={testData.stats.errorCount > 0 ? "warning" : "success"}
                    style={{ marginLeft: 16 }}
                >
                    {testData.stats.errorCount > 0
                        ? `${testData.stats.errorCount} Errors`
                        : "All Requests Successful"}
                </Tag>
            </Title>

            <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                <Descriptions.Item label="Test ID">{testData.id}</Descriptions.Item>
                <Descriptions.Item label="Execution Time">
                    {dayjs(testData.time).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="JMeter Results File">
                    {testData.fileName}
                </Descriptions.Item>
                <Descriptions.Item label="Total Requests">
                    {testData.resultDTO.sampleCount}
                </Descriptions.Item>

                {/* Display thread groups */}
                {testData.testPlan.threadStageGroups.map((group, index) => (
                    <Descriptions.Item
                        label={`Thread Group ${index + 1}`}
                        key={`thread-${index}`}
                        span={2}
                    >
                        URL: {group.url} |
                        Threads: {group.rampToThreads} |
                        Iterations: {group.holdIteration} |
                        Ramp-up: {group.rampDuration}s |
                        Hold: {group.holdDuration}s |
                        Follow Redirects: {group.followRedirects ? 'Yes' : 'No'}
                    </Descriptions.Item>
                ))}

                {/* Display RPS thread groups if any */}
                {testData.testPlan.rpsThreadStageGroups && testData.testPlan.rpsThreadStageGroups.map((group, index) => (
                    <Descriptions.Item
                        label={`RPS Group ${index + 1}`}
                        key={`rps-${index}`}
                        span={2}
                    >
                        URL: {group.url} |
                        Target RPS: {group.rampToThreads} |
                        Max Threads: {group.maxThreads} |
                        Ramp-up: {group.rampDuration}s |
                        Hold: {group.holdDuration}s |
                        Follow Redirects: {group.followRedirects ? 'Yes' : 'No'}
                    </Descriptions.Item>
                ))}
            </Descriptions>
        </Card>
    );
}
export default TestInfoPanel;