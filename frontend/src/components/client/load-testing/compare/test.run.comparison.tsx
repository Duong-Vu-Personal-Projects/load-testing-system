import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Divider, Typography, Button, Alert, Spin, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import {compareTestRunsAPI } from '../../../../services/api';
import ComparisonChart from "./dashboard/comparision.chart.tsx";
import MedianResponseTimeComparison from "./metrics/median.response.time.tsx";
import Percentile90Comparison from "./metrics/percentile.90.tsx";
import Percentile99Comparison from "./metrics/percentile.99.tsx";
import TotalRequestComparison from "./metrics/total.request.tsx";
import ErrorRateComparison from "./metrics/error.rate.compare.tsx";
import TestDurationComparison from "./metrics/test.duration.compare.tsx";
import TestRunCompareDetail from "./metrics/test.run.compare.detail.tsx";
import type {IComparisonResultDetail} from "./type.compare.tsx";


const { Title } = Typography;

interface ITestRunComparisonProps {
    runId1: string;
    runId2: string;
}

const TestRunComparison: React.FC<ITestRunComparisonProps> = (props: ITestRunComparisonProps) => {
    const {runId1, runId2} = props;
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [loading, setLoading] = useState<boolean>(true);
    const [comparisonData, setComparisonData] = useState<IComparisonResultDetail | null>(null);

    useEffect(() => {
        const fetchComparisonData = async () => {
            try {
                setLoading(true);
                const response = await compareTestRunsAPI(runId1, runId2);

                if (response.data) {
                    setComparisonData(response.data);
                } else {
                    notification.error({
                        message: 'Failed to load comparison data',
                        description: response.message || 'Unknown error'
                    });
                }
            } catch (error: any) {
                notification.error({
                    message: 'Error loading comparison data',
                    description: error.message || 'An unknown error occurred'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchComparisonData();
    }, [runId1, runId2, notification]);


    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Loading test runs for comparison...</p>
            </div>
        );
    }

    if (!comparisonData) {
        return (
            <Alert
                message="Comparison Data Not Available"
                description="Could not load comparison data for the selected test runs."
                type="error"
                showIcon
            />
        );
    }
    const planId = comparisonData.testPlanId;
    const {testRun1, testRun2} = comparisonData;
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
                data={comparisonData}
                metric="responseTime"
            />

            {/* Throughput and Error Rate Charts */}
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <ComparisonChart
                        data={comparisonData}
                        metric="throughput"
                    />
                </Col>
                <Col span={12}>
                    <ComparisonChart
                        data={comparisonData}
                        metric="errorRate"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default TestRunComparison;