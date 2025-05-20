import React, { useState } from 'react';
import { Form, Button, Card, Divider, Typography, notification, Tabs } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import type {ITestPlanFormValues, ITestResult} from "./type.test.plan.tsx";
import {createTestAPI} from "../../../../services/api.ts";
import TestPlanHeader from './test.plan.header.tsx';
import ThreadGroupForm from './thread.group.form.tsx';
import HttpConfigForm from "./http.config.form.tsx";
import ResultsSummary from "./result.summary.tsx";
import RpsThreadGroupForm from "./rps.thread.group.form.tsx";


const { Title } = Typography;
const { TabPane } = Tabs;

const initialValues: ITestPlanFormValues = {
  title: '',
  threadStageGroups: [{
    url: 'https://',
    rampDuration: 0,
    holdDuration: 0,
    rampToThreads: 5,
    throughputTimer: 0,
    holdIteration: 2
  }],
  rpsThreadStageGroups: [],
  httpMethod: 'GET',
  followRedirects: true,
  headers: [{ key: 'Content-Type', value: 'application/json' }],
  requestBody: '',
  contentType: 'application/json'
};

const CreateTestPlan: React.FC = () => {
  const [form] = Form.useForm<ITestPlanFormValues>();
  const [loading, setLoading] = useState(false);
  const [showBodyInput, setShowBodyInput] = useState(false);
  const [testResults, setTestResults] = useState<ITestResult | null>(null);
  const [activeTab, setActiveTab] = useState('threadGroups');

  const onHttpMethodChange = (value: string) => {
    const showBody = ['POST', 'PUT', 'PATCH'].includes(value);
    setShowBodyInput(showBody);

    if (!showBody) {
      form.setFieldsValue({ requestBody: '' });
    }
  };

  const onFinish = async (values: ITestPlanFormValues) => {
    try {
      setLoading(true);
      setTestResults(null);

      const requestPayload = {
        title: values.title,
        threadStageGroups: values.threadStageGroups || [],
        rpsThreadStageGroups: values.rpsThreadStageGroups || []
      };

      const response = await createTestAPI(requestPayload);
      if (response.data) {
        console.log(response.data);
        setTestResults(response.data);
        notification.success({
          message: 'Test Plan Executed Successfully',
          description: `Test "${values.title}" ran successfully!`
        });
      } else {
        notification.error({
          message: 'Test Plan Execution Failed',
          description: response.message,
        });
      }

    } catch (error: any) {
      // Handle error
      notification.error({
        message: 'Test Plan Execution Failed',
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

          <Divider orientation="left">HTTP Request Configuration</Divider>

          {/* HTTP Configuration */}
          <HttpConfigForm
              showBodyInput={showBodyInput}
              onHttpMethodChange={onHttpMethodChange}
          />

          <Form.Item style={{ marginTop: 24 }}>
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
            >
              Run Test Plan
            </Button>
          </Form.Item>
        </Form>

        {/* Test Results */}
        <ResultsSummary testResults={testResults} />
      </Card>
  );
};

export default CreateTestPlan;