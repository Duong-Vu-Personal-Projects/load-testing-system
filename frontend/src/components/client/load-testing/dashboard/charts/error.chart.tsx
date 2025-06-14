import React from 'react';
import { Card, Typography, Progress, Space } from 'antd';
import { Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

interface IErrorChartProps {
    successCounts: number;
    errorCounts: number;
}

const ErrorChart: React.FC<IErrorChartProps> = (props: IErrorChartProps) => {
    const {successCounts, errorCounts} = props;
    const total = successCounts + errorCounts;
    const successRate = total > 0 ? (successCounts / total) * 100 : 0;
    const data = [
        { type: 'Success', value: successCounts },
        { type: 'Error', value: errorCounts }
    ];
    const config = {
        data: data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        color: ['#52c41a', '#f5222d'],
        label: {
            text: 'value',
            position: 'outside',
        }
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