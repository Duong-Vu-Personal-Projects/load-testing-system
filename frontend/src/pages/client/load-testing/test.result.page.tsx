import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Breadcrumb, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TestResultDashboard from '../../../components/client/load-testing/dashboard/test.result.dashboard';

const { Title } = Typography;

const TestResultPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="test-result-page" style={{ padding: '20px' }}>
            {/* Breadcrumb navigation */}
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <a onClick={() => navigate('/plan')}>Test Plan</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Test Results</Breadcrumb.Item>
                <Breadcrumb.Item>{id}</Breadcrumb.Item>
            </Breadcrumb>

            {/* Page title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Title level={2}>Test Result Dashboard</Title>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/plan')}
                >
                    Back to Test Plans
                </Button>
            </div>

            {/* The actual dashboard */}
            <TestResultDashboard testId={id || ''} />
        </div>
    );
};

export default TestResultPage;