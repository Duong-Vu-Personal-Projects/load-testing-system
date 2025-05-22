import React, {useEffect, useState } from "react";
import type {ITestResultDetail} from "../create-test-plan/type.test.plan.tsx";
import {getTestResultByIdAPI} from "../../../../services/api.ts";
import {Alert, Card, Col, Divider, notification, Row, Spin} from "antd";
import TestInfoPanel from "./summary/test.info.panel.tsx";
import ResultsSummary from "../create-test-plan/result.summary.tsx";
import ResponseTimeChart from "./charts/response.time.chart.tsx";
import RequestsTable from "./charts/request.table.tsx";
import ThroughputChart from "./charts/throughput.chart.tsx";
import LatencyDistribution from "./charts/latency.distribution.chart.tsx";
import ErrorChart from "./charts/error.chart.tsx";

interface ITestResultDashboardProps {
    testId: string;
}
const TestResultDashboard: React.FC<ITestResultDashboardProps> = ( props:ITestResultDashboardProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [testData, setTestData] = useState<ITestResultDetail | null>(null);
    const {testId} = props;
    const fetchTestResult = async () => {
        try {
            setLoading(true);
            const response = await getTestResultByIdAPI(testId);
            if (response.data) {
                setTestData(response.data);
            } else {
                notification.error(
                    {
                        message: "Error Loading Data",
                        description: response.message
                    }
                )
            }
        } catch (err: any) {
            notification.error(
                {
                    message: 'Failed to load test data',
                    description: err.message
                }
            )
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts or testId changes
    useEffect(() => {
        if (testId) {
            fetchTestResult();
        }
    }, [testId]);

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 16 }}>Loading test results...</p>
                </div>
            </Card>
        );
    }

    if (!testData || !testData.resultDTO) {
        return (
            <Card>
                <Alert
                    message="No Test Data Available"
                    description="There is no test data available for the specified test ID."
                    type="info"
                    showIcon
                />
            </Card>
        );
    }

    return (
        <div className="test-result-dashboard">

            {/* Test Information Panel */}
            <TestInfoPanel testData={testData} />

            <Divider orientation="left">Summary Statistics</Divider>

            {/* Statistics Summary Cards */}
            <ResultsSummary testResults={testData} />

            <Divider orientation="left">Response Time & Throughput</Divider>

            {/* Charts Section */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <ResponseTimeChart
                        relativeTimes={testData.resultDTO.relativeTimes}
                        responseTimes={testData.resultDTO.elapsedTimes}
                        readableTimes={testData.resultDTO.readableTimes}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <ThroughputChart
                        throughputData={testData.resultDTO.throughputData || []}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} lg={12}>
                    <LatencyDistribution
                        latencies={testData.resultDTO.latencies}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <ErrorChart
                        successCounts={testData.resultDTO.sampleCount - testData.resultDTO.errorCount}
                        errorCounts={testData.resultDTO.errorCount}
                    />
                </Col>
            </Row>

            <Divider orientation="left">Request Details</Divider>

            {/* Detailed Requests Table */}
            <RequestsTable resultDTO = {testData.resultDTO} />
        </div>
    );
};
export default TestResultDashboard;