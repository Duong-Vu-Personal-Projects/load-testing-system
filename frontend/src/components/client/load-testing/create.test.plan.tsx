import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Switch, Card, Collapse, Alert, Divider, Typography, Space, notification } from 'antd';
import { SendOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import {createTestAPI} from "../../../services/api.ts";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

interface TestPlanFormValues {
  title: string;
  url: string;
  threads: number;
  iterations: number;
  rampUpPeriodSeconds: number;
  throughputTimer: number;
  httpMethod: string;
  followRedirects: boolean;
  headers: { key: string; value: string }[];
  requestBody?: string;
  contentType?: string;
}

const initialValues: TestPlanFormValues = {
  title: '',
  url: 'https://',
  threads: 5,
  iterations: 10,
  rampUpPeriodSeconds: 2,
  throughputTimer: 0,
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
      
      // Convert headers array to object format expected by backend
      const headerObject: Record<string, string> = {};
      values.headers.forEach(header => {
        if (header.key && header.value) {
          headerObject[header.key] = header.value;
        }
      });
      
      // Prepare request payload
      const requestPayload = {
        ...values,
        headers: headerObject
      };
      
      // Send API request
      const response = await createTestAPI(requestPayload);
      
      // Handle successful response
      setTestResults(response.data);
      notification.success({
        message: 'Test Plan Executed Successfully',
        description: `Test "${values.title}" ran successfully!`
      });
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
        <Form.Item
          name="title"
          label="Test Plan Title"
          rules={[{ required: true, message: 'Please provide a title for your test plan' }]}
        >
          <Input placeholder="Enter a unique title for this test plan" />
        </Form.Item>
        
        <Form.Item
          name="url"
          label="URL to Test"
          rules={[
            { required: true, message: 'Please enter the URL to test' },
            { type: 'url', message: 'Please enter a valid URL' }
          ]}
        >
          <Input placeholder="https://example.com/api" />
        </Form.Item>
        
        <Divider orientation="left">Load Configuration</Divider>
        
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            name="threads"
            label="Number of Threads (Users)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={1000} />
          </Form.Item>
          
          <Form.Item
            name="iterations"
            label="Number of Iterations"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={1000} />
          </Form.Item>
          
          <Form.Item
            name="rampUpPeriodSeconds"
            label="Ramp-up Period (seconds)"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          
          <Form.Item
            name="throughputTimer"
            label="Throughput Limit (reqs/sec, 0 = unlimited)"
          >
            <InputNumber min={0} />
          </Form.Item>
        </Space>
        
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
                <Text>Error Rate: {testResults.stats.errorRate ? (testResults.errorRate * 100).toFixed(2) : '0'}%</Text><br />
              </Card>
              
              <Card size="small" title="Data Transfer">
                <Text>Received: {(testResults.stats.receivedBytes / 1024).toFixed(2) || 'N/A'} KB</Text><br />
                <Text>Sent: {(testResults.stats.sentBytes / 1024).toFixed(2) || 'N/A'} KB</Text><br />
                <Text>Duration: {(testResults.stats.duration / 1000).toFixed(2) || 'N/A'} s</Text>
              </Card>
            </div>
            
            {testResults.errorCount > 0 && (
              <Alert 
                message="Errors Detected" 
                description={`${testResults.errorCount} errors occurred during the test execution.`}
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