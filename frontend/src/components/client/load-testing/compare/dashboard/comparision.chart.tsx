import React from 'react';
import { Card, Typography } from 'antd';
import ResponseTimeComparisonChart from "./response.time.compare.tsx";
import ThroughputComparisonChart from "./throughput.compare.tsx";
import ErrorRateComparisonChart from "./error.rate.compare.tsx";
import type {IComparisonResultDetail} from "../type.compare.tsx";

const { Title, Text } = Typography;

interface IComparisonChartProps {
    data: IComparisonResultDetail;
    metric: 'responseTime' | 'throughput' | 'errorRate';
}

const ComparisonChart: React.FC<IComparisonChartProps> = (props: IComparisonChartProps) => {
    const {data, metric} = props;
    if (metric === 'responseTime') {
        return <ResponseTimeComparisonChart
            responseTimeComparison = {data.responseTimeComparison}
        />
    } else if (metric === 'throughput') {
        return <ThroughputComparisonChart
            throughputComparison={data.throughputComparison}
            />
    } else if (metric === 'errorRate') {
        return <ErrorRateComparisonChart
            testRun1 = {data.testRun1}
            testRun2 = {data.testRun2}
            errorRateComparison={data.errorRateComparison}
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