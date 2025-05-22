import { Breadcrumb } from "antd";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import TestRunComparison from "../../../components/client/load-testing/compare/test.run.comparison";

const TestRunComparisonPage: React.FC = () => {
    const {planId, runId1, runId2} = useParams<{planId: string, runId1: string, runId2: string}>();
    const navigate = useNavigate();
    return (
        <>
            <div className="test-run-comparison-page" style={{ padding: '20px' }}>
                {/* Breadcrumb navigation */}
                <Breadcrumb style={{ marginBottom: 16 }}>
                    <Breadcrumb.Item>
                        <a onClick={() => navigate('/plan')}>Test Plans</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a onClick={() => navigate(`/plan/${planId}`)}>Test Plan Details</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a onClick={() => navigate(`/plan/runs/${planId}`)}>Test Run History</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Compare Test Runs</Breadcrumb.Item>
                </Breadcrumb>

                {/* The actual comparison component */}
                <TestRunComparison runId1={runId1 || ''} runId2={runId2 || ''} />
            </div>
        </>
    )
}
export default TestRunComparisonPage;