import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Divider, Typography, Button, Alert, Spin, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ITestResultDetail } from '../create-test-plan/type.test.plan';
import { getTestResultByIdAPI } from '../../../../services/api';
import ComparisonChart from "./dashboard/comparision.chart.tsx";
import MedianResponseTimeComparison from "./metrics/median.response.time.tsx";
import Percentile90Comparison from "./metrics/percentile.90.tsx";
import Percentile99Comparison from "./metrics/percentile.99.tsx";
import TotalRequestComparison from "./metrics/total.request.tsx";
import ErrorRateComparison from "./metrics/error.rate.compare.tsx";
import TestDurationComparison from "./metrics/test.duration.compare.tsx";
import TestRunCompareDetail from "./metrics/test.run.compare.detail.tsx";


const { Title } = Typography;

interface ITestRunComparisonProps {
    runId1: string;
    runId2: string;
}

const TestRunComparison: React.FC<ITestRunComparisonProps> = ({ runId1, runId2 }) => {
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [loading1, setLoading1] = useState<boolean>(true);
    const [loading2, setLoading2] = useState<boolean>(true);
    const [testRun1, setTestRun1] = useState<ITestResultDetail | null>(null);
    const [testRun2, setTestRun2] = useState<ITestResultDetail | null>(null);

    useEffect(() => {
        const fetchTestRunData = async () => {
            try {
                setLoading1(true);
                setLoading2(true);

                const [response1, response2] = await Promise.all([
                    getTestResultByIdAPI(runId1),
                    getTestResultByIdAPI(runId2)
                ]);

                if (response1.data) {
                    setTestRun1(response1.data);
                } else {
                    notification.error({
                        message: 'Failed to load first test run',
                        description: 'Could not retrieve test run data'
                    });
                }

                if (response2.data) {
                    setTestRun2(response2.data);
                } else {
                    notification.error({
                        message: 'Failed to load second test run',
                        description: 'Could not retrieve test run data'
                    });
                }
            } catch (error: any) {
                notification.error({
                    message: 'Error loading test run data',
                    description: error.message || 'An unknown error occurred'
                });
            } finally {
                setLoading1(false);
                setLoading2(false);
            }
        };

        fetchTestRunData();
    }, [runId1, runId2, notification]);


    if (loading1 || loading2) {
        return (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Loading test runs for comparison...</p>
            </div>
        );
    }

    if (!testRun1 || !testRun2) {
        return (
            <Alert
                message="Test Run Data Not Available"
                description="One or both of the selected test runs could not be loaded."
                type="error"
                showIcon
            />
        );
    }

    const planId = testRun1.testPlan.id;

    return (
        <div className="test-run-comparison">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Title level={2}>Test Run Comparison</Title>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/plan/runs/${planId}`)}
                >
                    Back to Test Run History
                </Button>
            </div>

            {/* Basic Information */}
            <Row gutter={16}>
                <Col span={12}>
                    <TestRunCompareDetail testRun={testRun1}/>
                </Col>
                <Col span={12}>
                    <TestRunCompareDetail testRun={testRun2}/>
                </Col>
            </Row>

            <Divider>Performance Metrics Comparison</Divider>

            {/* Response Time Comparison */}
            <Card title="Response Time Comparison" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <MedianResponseTimeComparison testRun1={testRun1} testRun2={testRun2}/>
                    </Col>
                    <Col span={8}>
                        <Percentile90Comparison testRun1={testRun1} testRun2={testRun2}/>
                    </Col>
                    <Col span={8}>
                        <Percentile99Comparison testRun1={testRun1} testRun2={testRun2}/>
                    </Col>
                </Row>
            </Card>

            {/* Throughput Comparison */}
            <Card title="Throughput Comparison" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <TotalRequestComparison testRun1={testRun1} testRun2={testRun2}/>
                    </Col>
                    <Col span={8}>
                        <ErrorRateComparison testRun1={testRun1} testRun2={testRun2}/>
                    </Col>
                    <Col span={8}>
                        <TestDurationComparison testRun1={testRun1} testRun2={testRun2}/>
                    </Col>
                </Row>
            </Card>

            {/* Visual comparison charts */}
            <Divider>Visual Comparison</Divider>

            {/* Response Time Chart */}
            <ComparisonChart
                testRun1={testRun1}
                testRun2={testRun2}
                metric="responseTime"
            />

            {/* Throughput and Error Rate Charts */}
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <ComparisonChart
                        testRun1={testRun1}
                        testRun2={testRun2}
                        metric="throughput"
                    />
                </Col>
                <Col span={12}>
                    <ComparisonChart
                        testRun1={testRun1}
                        testRun2={testRun2}
                        metric="errorRate"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default TestRunComparison;