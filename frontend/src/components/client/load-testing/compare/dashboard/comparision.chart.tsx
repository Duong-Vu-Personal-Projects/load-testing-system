import React from 'react';
import { Card, Typography } from 'antd';
import type { ITestResultDetail } from "../../create-test-plan/type.test.plan";
import ResponseTimeComparisonChart from "./response.time.compare.tsx";
import ThroughputComparisonChart from "./throughput.compare.tsx";
import ErrorRateComparisonChart from "./error.rate.compare.tsx";

const { Title, Text } = Typography;

interface IComparisonChartProps {
    testRun1: ITestResultDetail;
    testRun2: ITestResultDetail;
    metric: 'responseTime' | 'throughput' | 'errorRate';
}

const ComparisonChart: React.FC<IComparisonChartProps> = (props: IComparisonChartProps) => {
    const {testRun1, testRun2, metric} = props;
    if (metric === 'responseTime') {
        return <ResponseTimeComparisonChart
            testRun1 = {testRun1}
            testRun2 = {testRun2}
        />
    } else if (metric === 'throughput') {
        return <ThroughputComparisonChart
            testRun1 = {testRun1}
            testRun2 = {testRun2}
            />
    } else if (metric === 'errorRate') {
        return <ErrorRateComparisonChart
            testRun1 = {testRun1}
            testRun2 = {testRun2}
            />
    }

    return (
        <Card>
            <Title level={4}>Invalid Metric Type</Title>
            <Text>Please provide a valid metric type: responseTime, throughput, or errorRate</Text>
        </Card>
    );
};

export default ComparisonChart;