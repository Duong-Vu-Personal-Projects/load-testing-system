import React, { useState } from 'react';
import { Form, Button, Card, Divider, Typography, notification, Tabs } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type {IRequestCreateTestPlan, ITestPlanFormValues} from "./type.test.plan.tsx";
import {createTestPlanAPI} from "../../../../services/api.ts";
import TestPlanHeader from './test.plan.header.tsx';
import ThreadGroupForm from './thread.group.form.tsx';
import RpsThreadGroupForm from "./rps.thread.group.form.tsx";
import {useNavigate} from "react-router-dom";

const CreateTestPlan: React.FC = () => {
  const { Title } = Typography;
  const { TabPane } = Tabs;

  const initialValues: ITestPlanFormValues = {
    title: '',
    threadStageGroups: [],
    rpsThreadStageGroups: [],
    httpMethod: 'GET',
    followRedirects: true,
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    requestBody: '',
    contentType: 'application/json'
  };
  const [form] = Form.useForm<ITestPlanFormValues>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('threadGroups');
  const navigate = useNavigate();

  const onFinish = async (values: ITestPlanFormValues) => {
    try {
      setLoading(true);
      const requestPayload: IRequestCreateTestPlan = {
        title: values.title,
        threadStageGroups: values.threadStageGroups || [],
        rpsThreadStageGroups: values.rpsThreadStageGroups || []
      };

      const response = await createTestPlanAPI(requestPayload);
      if (response.data) {
        notification.success({
          message: 'Create Test Plan Successfully',
          description: `Test Plan "${values.title}" created successfully!`
        });
        navigate(`/plan/${response.data.id}`)
      } else {
        notification.error({
          message: 'Failed to create test plan',
          description: response.message,
        });
      }

    } catch (error: any) {
      // Handle error
      notification.error({
        message: 'Failed to create test plan',
        description: error.response?.data?.message || error.message || 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Card title={<Title level={3}>Create JMeter Test Plan</Title>}>
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
            requiredMark={true}
        >
          {/* Test Plan Title */}
          <TestPlanHeader />

          <Divider orientation="left">Load Configuration</Divider>

          {/* Thread Groups Tabs */}
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Thread Stage Groups" key="threadGroups">
              <ThreadGroupForm />
            </TabPane>

            <TabPane tab="RPS Thread Stage Groups" key="rpsGroups">
              <RpsThreadGroupForm />
            </TabPane>
          </Tabs>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
            >
              Create Test Plan
            </Button>
          </Form.Item>
        </Form>
      </Card>
  );
};

export default CreateTestPlan;