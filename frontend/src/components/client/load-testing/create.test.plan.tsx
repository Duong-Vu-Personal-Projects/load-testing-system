import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Switch, Card, Collapse, Alert, Divider, Typography, Space, notification, Tabs } from 'antd';
import { SendOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { createTestAPI } from "../../../services/api.ts";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Update the interface to match backend structure
interface ThreadStageGroup {
  url: string;
  rampDuration: number;
  holdDuration: number;
  rampToThreads: number;
  throughputTimer: number;
  holdIteration: number;
}

interface RpsThreadStageGroup {
  url: string;
  rampDuration: number;
  holdDuration: number;
  rampToThreads: number;
  throughputTimer: number;
  maxThreads: number;
}

interface TestPlanFormValues {
  title: string;
  threadStageGroups: ThreadStageGroup[];
  rpsThreadStageGroups: RpsThreadStageGroup[];
  // HTTP configuration for UI only (will be mapped to URLs in thread groups)
  httpMethod: string;
  followRedirects: boolean;
  headers: { key: string; value: string }[];
  requestBody?: string;
  contentType?: string;
}

const initialValues: TestPlanFormValues = {
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
  const [form] = Form.useForm<TestPlanFormValues>();
  const [loading, setLoading] = useState(false);
  const [showBodyInput, setShowBodyInput] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('threadGroups');

  // Update visible fields based on HTTP method
  const onHttpMethodChange = (value: string) => {
    const showBody = ['POST', 'PUT', 'PATCH'].includes(value);
    setShowBodyInput(showBody);

    if (!showBody) {
      form.setFieldsValue({ requestBody: '' });
    }
  };

  const onFinish = async (values: TestPlanFormValues) => {
    try {
      setLoading(true);
      setTestResults(null);

      // Initialize empty header object (with null check for headers)
      const headerObject: Record<string, string> = {};
      if (values.headers && Array.isArray(values.headers)) {
        values.headers.forEach(header => {
          if (header && header.key && header.value) {
            headerObject[header.key] = header.value;
          }
        });
      }

      // Check if threadStageGroups exists before mapping
      const updatedThreadGroups = values.threadStageGroups && Array.isArray(values.threadStageGroups)
          ? values.threadStageGroups.map(group => ({
            ...group,
          }))
          : [];

      // Check if rpsThreadStageGroups exists before mapping
      const updatedRpsGroups = values.rpsThreadStageGroups && Array.isArray(values.rpsThreadStageGroups)
          ? values.rpsThreadStageGroups.map(group => ({
            ...group,
          }))
          : [];

      // Prepare request payload
      const requestPayload = {
        title: values.title || 'Untitled Test Plan',
        threadStageGroups: updatedThreadGroups,
        rpsThreadStageGroups: updatedRpsGroups
      };

      console.log('Sending payload:', requestPayload); // Debugging

      // Send API request
      const response = await createTestAPI(requestPayload);

      // Handle successful response
      setTestResults(response.data);
      notification.success({
        message: 'Test Plan Executed Successfully',
        description: `Test "${values.title}" ran successfully!`
      });
    } catch (error: any) {
      console.error('Error executing test plan:', error); // Detailed logging

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
          <Form.Item
              name="title"
              label="Test Plan Title"
              rules={[{ required: true, message: 'Please provide a title for your test plan' }]}
          >
            <Input placeholder="Enter a unique title for this test plan" />
          </Form.Item>

          <Divider orientation="left">Load Configuration</Divider>

          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Thread Stage Groups" key="threadGroups">
              <Form.List name="threadStageGroups">
                {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                          <Card
                              key={key}
                              title={`Thread Group ${name + 1}`}
                              extra={fields.length > 1 ? <DeleteOutlined onClick={() => remove(name)} /> : null}
                              style={{ marginBottom: 16 }}
                          >
                            <Form.Item
                                {...restField}
                                name={[name, 'url']}
                                label="URL to Test"
                                rules={[
                                  { required: true, message: 'Please enter the URL to test' },
                                  { type: 'url', message: 'Please enter a valid URL' }
                                ]}
                            >
                              <Input placeholder="https://example.com/api" />
                            </Form.Item>

                            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Form.Item
                                  {...restField}
                                  name={[name, 'rampToThreads']}
                                  label="Number of Threads (Users)"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={1} max={1000} />
                              </Form.Item>

                              <Form.Item
                                  {...restField}
                                  name={[name, 'holdIteration']}
                                  label="Number of Iterations"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={1} max={1000} />
                              </Form.Item>
                            </Space>

                            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Form.Item
                                  {...restField}
                                  name={[name, 'rampDuration']}
                                  label="Ramp-up Period (seconds)"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={0} />
                              </Form.Item>

                              <Form.Item
                                  {...restField}
                                  name={[name, 'holdDuration']}
                                  label="Hold Duration (seconds)"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={0} />
                              </Form.Item>
                            </Space>

                            <Form.Item
                                {...restField}
                                name={[name, 'throughputTimer']}
                                label="Throughput Limit (reqs/sec, 0 = unlimited)"
                            >
                              <InputNumber min={0} />
                            </Form.Item>
                          </Card>
                      ))}

                      <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add({
                              url: 'https://',
                              rampDuration: 0,
                              holdDuration: 0,
                              rampToThreads: 5,
                              throughputTimer: 0,
                              holdIteration: 2
                            })}
                            block
                            icon={<PlusOutlined />}
                        >
                          Add Thread Stage Group
                        </Button>
                      </Form.Item>
                    </>
                )}
              </Form.List>
            </TabPane>

            <TabPane tab="RPS Thread Stage Groups" key="rpsGroups">
              <Form.List name="rpsThreadStageGroups">
                {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                          <Card
                              key={key}
                              title={`RPS Thread Group ${name + 1}`}
                              extra={<DeleteOutlined onClick={() => remove(name)} />}
                              style={{ marginBottom: 16 }}
                          >
                            <Form.Item
                                {...restField}
                                name={[name, 'url']}
                                label="URL to Test"
                                rules={[
                                  { required: true, message: 'Please enter the URL to test' },
                                  { type: 'url', message: 'Please enter a valid URL' }
                                ]}
                            >
                              <Input placeholder="https://example.com/api" />
                            </Form.Item>

                            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Form.Item
                                  {...restField}
                                  name={[name, 'rampToThreads']}
                                  label="Target RPS"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={1} max={1000} />
                              </Form.Item>

                              <Form.Item
                                  {...restField}
                                  name={[name, 'maxThreads']}
                                  label="Max Threads"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={1} max={1000} />
                              </Form.Item>
                            </Space>

                            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Form.Item
                                  {...restField}
                                  name={[name, 'rampDuration']}
                                  label="Ramp-up Period (seconds)"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={0} />
                              </Form.Item>

                              <Form.Item
                                  {...restField}
                                  name={[name, 'holdDuration']}
                                  label="Hold Duration (seconds)"
                                  rules={[{ required: true }]}
                              >
                                <InputNumber min={0} />
                              </Form.Item>
                            </Space>

                            <Form.Item
                                {...restField}
                                name={[name, 'throughputTimer']}
                                label="Throughput Limit (reqs/sec, 0 = unlimited)"
                            >
                              <InputNumber min={0} />
                            </Form.Item>
                          </Card>
                      ))}

                      <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add({
                              url: 'https://',
                              rampDuration: 0,
                              holdDuration: 0,
                              rampToThreads: 10,
                              throughputTimer: 0,
                              maxThreads: 50
                            })}
                            block
                            icon={<PlusOutlined />}
                        >
                          Add RPS Thread Stage Group
                        </Button>
                      </Form.Item>
                    </>
                )}
              </Form.List>
            </TabPane>
          </Tabs>

          <Divider orientation="left">HTTP Request Configuration</Divider>

          <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Item
                name="httpMethod"
                label="HTTP Method"
                rules={[{ required: true }]}
            >
              <Select style={{ width: 120 }} onChange={onHttpMethodChange}>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="PATCH">PATCH</Option>
                <Option value="HEAD">HEAD</Option>
              </Select>
            </Form.Item>

            <Form.Item
                name="followRedirects"
                label="Follow Redirects"
                valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Space>

          <Collapse defaultActiveKey={[]}>
            <Panel header="HTTP Headers" key="headers">
              <Form.List name="headers">
                {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                                {...restField}
                                name={[name, 'key']}
                                rules={[{ required: true, message: 'Header name is required' }]}
                            >
                              <Input placeholder="Header Name" />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                name={[name, 'value']}
                                rules={[{ required: true, message: 'Header value is required' }]}
                            >
                              <Input placeholder="Header Value" />
                            </Form.Item>
                            <DeleteOutlined onClick={() => remove(name)} />
                          </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Add Header
                        </Button>
                      </Form.Item>
                    </>
                )}
              </Form.List>
            </Panel>

            {showBodyInput && (
                <Panel header="Request Body" key="body">
                  <Form.Item name="contentType" label="Content Type">
                    <Select style={{ width: 200 }}>
                      <Option value="application/json">JSON</Option>
                      <Option value="application/x-www-form-urlencoded">Form URL Encoded</Option>
                      <Option value="text/plain">Plain Text</Option>
                      <Option value="application/xml">XML</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="requestBody" label="Body">
                    <TextArea rows={6} placeholder="Enter request body here" />
                  </Form.Item>
                </Panel>
            )}
          </Collapse>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
              Run Test Plan
            </Button>
          </Form.Item>
        </Form>

        {testResults && (
            <>
              <Divider orientation="left">Test Results</Divider>
              <Card>
                <Title level={4}>Test Execution Summary</Title>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <Card size="small" title="Response Time">
                    <Text>Min: {testResults.stats.minResponseTime || 'N/A'} ms</Text><br />
                    <Text>Max: {testResults.stats.maxResponseTime || 'N/A'} ms</Text><br />
                    <Text>p99: {testResults.stats.sampleTimePercentile99 || 'N/A'} ms</Text>
                  </Card>

                  <Card size="small" title="Throughput">
                    <Text>Total Requests: {testResults.stats.sampleCounts || 'N/A'}</Text><br />
                    <Text>Error Count: {testResults.stats.errorCount || 0}</Text><br />
                    <Text>Error Rate: {testResults.stats.errorRate ? (testResults.stats.errorRate * 100).toFixed(2) : '0'}%</Text><br />
                  </Card>

                  <Card size="small" title="Data Transfer">
                    <Text>Received: {(testResults.stats.receivedBytes / 1024).toFixed(2) || 'N/A'} KB</Text><br />
                    <Text>Sent: {(testResults.stats.sentBytes / 1024).toFixed(2) || 'N/A'} KB</Text><br />
                    <Text>Duration: {(testResults.stats.duration / 1000).toFixed(2) || 'N/A'} s</Text>
                  </Card>
                </div>

                {testResults.stats.errorCount > 0 && (
                    <Alert
                        message="Errors Detected"
                        description={`${testResults.stats.errorCount} errors occurred during the test execution.`}
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                )}
              </Card>
            </>
        )}
      </Card>
  );
};

export default CreateTestPlan;