import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Spin, Alert, Button, Typography, Space, 
  Breadcrumb, Descriptions, Collapse, Tag, App
} from 'antd';
import { 
  ArrowLeftOutlined, HistoryOutlined, PlayCircleOutlined
} from '@ant-design/icons';
import { getTestPlanDetailAPI, runTestPlanAPI } from "../../../../services/api.ts";
import type {IThreadStageGroup, IRpsThreadStageGroup, ITestPlan} from "../create-test-plan/type.test.plan.tsx";

const { Title } = Typography;
const { Panel } = Collapse;

const TestPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);
  const [testPlanData, setTestPlanData] = useState<ITestPlan | null>(null);
  useEffect(() => {
    const fetchTestPlanData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getTestPlanDetailAPI(id);
        
        if (response.data) {
          setTestPlanData(response.data);
        } else {
          notification.error({
            message: "Failed to get test plan detail",
            description: response.message
          })
        }
      } catch (err: any) {
        notification.error({
          message: 'An error occurred while fetching test plan data',
          description: err?.message
        })
      } finally {
        setLoading(false);
      }
    };

    fetchTestPlanData();
  }, [id]);

  // Handle running the test
  const handleRunTest = async () => {
    if (!id) return;
    
    try {
      setExecuting(true);
      notification.info({
        message: 'Test Execution Started',
        description: 'The test plan is now being executed. This may take some time.'
      });
      
      const payload = {
        id: id
      };
      
      const response = await runTestPlanAPI(payload.id);
      
      if (response.data) {
        notification.success({
          message: 'Test Executed Successfully',
          description: `Test "${testPlanData?.title}" ran successfully!`
        });
        
        // Navigate to the test results page
        navigate(`/plan/test-run/${response.data.id}`);
      } else {
        notification.error({
          message: 'Test Execution Failed',
          description: response.message || 'Unknown error occurred'
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Test Execution Failed',
        description: error.message || 'An error occurred while running the test'
      });
    } finally {
      setExecuting(false);
    }
  };

  // View test run history
  const handleViewHistory = () => {
    navigate(`/plan/runs/${id}`);
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading test plan details...</p>
        </div>
      </Card>
    );
  }
  if (!testPlanData) {
    return (
      <Card>
        <Alert
          message="Test Plan Not Found"
          description="The requested test plan could not be found."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  // Render the thread stage groups details
  const renderThreadGroups = (threadGroups: IThreadStageGroup[]) => {
    if (!threadGroups || threadGroups.length === 0) {
      return (
        <Alert
          message="No Thread Groups"
          description="This test plan doesn't have any thread groups configured."
          type="info"
          showIcon
        />
      );
    }

    return (
      <Collapse defaultActiveKey={['0']}>
        {threadGroups.map((group, index) => (
          <Panel 
            header={`Group ${index + 1}: ${group.url}`} 
            key={index.toString()}
            extra={<Tag color="blue">{group.rampToThreads} Threads</Tag>}
          >
            <Descriptions bordered size="small" column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="URL">{group.url}</Descriptions.Item>
              <Descriptions.Item label="Threads">{group.rampToThreads}</Descriptions.Item>
              <Descriptions.Item label="Ramp Duration">{group.rampDuration}s</Descriptions.Item>
              <Descriptions.Item label="Hold Duration">{group.holdDuration}s</Descriptions.Item>
              <Descriptions.Item label="Hold Iterations">{group.holdIteration}</Descriptions.Item>
              <Descriptions.Item label="Throughput Timer">{group.throughputTimer}</Descriptions.Item>
              <Descriptions.Item label="Follow Redirects">
                {group.isFollowRedirects ? 'Yes' : 'No'}
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        ))}
      </Collapse>
    );
  };

  // Render the RPS thread stage groups details
  const renderRpsGroups = (rpsGroups: IRpsThreadStageGroup[]) => {
    if (!rpsGroups || rpsGroups.length === 0) {
      return (
        <Alert
          message="No RPS Thread Groups"
          description="This test plan doesn't have any RPS thread groups configured."
          type="info"
          showIcon
        />
      );
    }

    return (
      <Collapse>
        {rpsGroups.map((group, index) => (
          <Panel 
            header={`Group ${index + 1}: ${group.url}`} 
            key={index.toString()}
            extra={<Tag color="green">{group.rampToThreads} RPS</Tag>}
          >
            <Descriptions bordered size="small" column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
              <Descriptions.Item label="URL">{group.url}</Descriptions.Item>
              <Descriptions.Item label="RPS">{group.rampToThreads}</Descriptions.Item>
              <Descriptions.Item label="Ramp Duration">{group.rampDuration}s</Descriptions.Item>
              <Descriptions.Item label="Hold Duration">{group.holdDuration}s</Descriptions.Item>
              <Descriptions.Item label="Throughput Timer">{group.throughputTimer}</Descriptions.Item>
              <Descriptions.Item label="Max Threads">{group.maxThreads}</Descriptions.Item>
              <Descriptions.Item label="Follow Redirects">
                {group.isFollowRedirects ? 'Yes' : 'No'}
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        ))}
      </Collapse>
    );
  };

  return (
    <div className="test-plan-detail">
      {/* Breadcrumb navigation */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <a onClick={() => navigate('/plan')}>Test Plan</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Test Plan Details</Breadcrumb.Item>
        <Breadcrumb.Item>{testPlanData.title}</Breadcrumb.Item>
      </Breadcrumb>
      
      {/* Header with actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>
          Test Plan: {testPlanData.title}
        </Title>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/plan')}
          >
            Back to Test Plans
          </Button>
          <Button 
            icon={<HistoryOutlined />}
            onClick={handleViewHistory}
          >
            View Run History
          </Button>
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />} 
            onClick={handleRunTest}
            loading={executing}
          >
            Run Test Plan
          </Button>
        </Space>
      </div>
      
      {/* Test Plan Details Card */}
      <Card>
        <Descriptions
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
          title="Basic Information"
        >
          <Descriptions.Item label="ID">{testPlanData.id}</Descriptions.Item>
          <Descriptions.Item label="Title">{testPlanData.title}</Descriptions.Item>
          <Descriptions.Item label="Thread Groups">{testPlanData.threadStageGroups?.length || 0}</Descriptions.Item>
          <Descriptions.Item label="RPS Groups">{testPlanData.rpsThreadStageGroups?.length || 0}</Descriptions.Item>
        </Descriptions>

        {/* Thread Stage Groups */}
        {testPlanData.threadStageGroups && testPlanData.threadStageGroups.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>Thread Stage Groups</Title>
            {renderThreadGroups(testPlanData.threadStageGroups)}
          </div>
        )}

        {/* RPS Thread Stage Groups */}
        {testPlanData.rpsThreadStageGroups && testPlanData.rpsThreadStageGroups.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={4}>RPS Thread Stage Groups</Title>
            {renderRpsGroups(testPlanData.rpsThreadStageGroups)}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TestPlanDetail;