import React from 'react';
import { Card, Typography, Alert, Divider } from 'antd';
import type {ITestResult} from "./type.test.plan.tsx";

const { Title, Text } = Typography;

interface IResultsSummaryProps {
    testResults: ITestResult | null;
}

const ResultsSummary: React.FC<IResultsSummaryProps> = ({ testResults }) => {
    if (!testResults) return null;

    const { stats } = testResults;

    return (
        <>
            <Divider orientation="left">Test Results</Divider>
            <Card>
                <Title level={4}>Test Execution Summary</Title>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <Card size="small" title="Response Time">
                        <Text>Min: {stats.minResponseTime || 'N/A'} ms</Text><br />
                        <Text>Max: {stats.maxResponseTime || 'N/A'} ms</Text><br />
                        <Text>p99: {stats.sampleTimePercentile99 || 'N/A'} ms</Text>
                    </Card>

                    <Card size="small" title="Throughput">
                        <Text>Total Requests: {stats.sampleCounts || 'N/A'}</Text><br />
                        <Text>Error Count: {stats.errorCount || 0}</Text><br />
                        <Text>Error Rate: {stats.errorRate ? (stats.errorRate * 100).toFixed(2) : '0'}%</Text><br />
                    </Card>

                    <Card size="small" title="Data Transfer">
                        <Text>Received: {(stats.receivedBytes / 1024).toFixed(2) || 'N/A'} KB</Text><br />
                        <Text>Sent: {(stats.sentBytes / 1024).toFixed(2) || 'N/A'} KB</Text><br />
                        <Text>Duration: {(stats.duration / 1000).toFixed(2) || 'N/A'} s</Text>
                    </Card>
                </div>

                {stats.errorCount > 0 && (
                    <Alert
                        message="Errors Detected"
                        description={`${stats.errorCount} errors occurred during the test execution.`}
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                )}
            </Card>
        </>
    );
};

export default ResultsSummary;