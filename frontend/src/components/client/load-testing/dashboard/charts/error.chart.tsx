import React from 'react';
import { Card, Typography, Progress, Space } from 'antd';
import { Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

interface IErrorChartProps {
    successCounts: number;
    errorCounts: number;
}

/**
 * Displays a pie chart showing success vs error rates
 */
const ErrorChart: React.FC<IErrorChartProps> = (props: IErrorChartProps) => {
    const {successCounts, errorCounts} = props;
    const total = successCounts + errorCounts;
    const successRate = total > 0 ? (successCounts / total) * 100 : 0;

    // Data for the chart
    const data = [
        { type: 'Success', value: successCounts },
        { type: 'Error', value: errorCounts }
    ];

    // Chart configuration
    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        color: ['#52c41a', '#f5222d'],
        label: {
            type: 'outer',
            // Fix: Define the parameter types properly and handle undefined case
            content: ({ name, percent }: { name?: string; percent?: number }) => {
                return `${name || ''}: ${percent ? (percent * 100).toFixed(1) : 0}%`;
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    return (
        <Card>
            <Title level={4}>Success/Error Rate</Title>

            {/* Progress bar showing success rate percentage */}
            <div style={{ marginBottom: 20 }}>
                <Progress
                    percent={successRate}
                    status={errorCounts > 0 ? "exception" : "success"}
                    // Fix: Add null check for percent parameter
                    format={(percent?: number) => `${percent?.toFixed(2) || '0.00'}% Success`}
                />
            </div>

            {/* Success/Error counts */}
            <Space direction="vertical" style={{ width: '100%', marginBottom: 20 }}>
                <Text>
                    <Text strong>Total Requests:</Text> {total}
                </Text>
                <Text>
                    <Text strong style={{ color: '#52c41a' }}>Successful:</Text> {successCounts}
                </Text>
                <Text>
                    <Text strong style={{ color: '#f5222d' }}>Failed:</Text> {errorCounts}
                </Text>
            </Space>

            {/* Only render pie chart if we have data */}
            {total > 0 && <Pie {...config} />}
        </Card>
    );
};

export default ErrorChart;