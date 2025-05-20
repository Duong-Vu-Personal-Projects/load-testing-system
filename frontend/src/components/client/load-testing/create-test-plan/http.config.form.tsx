import React from 'react';
import { Form, Select, Switch, Space, Collapse, Input, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

interface IHttpConfigFormProps {
    showBodyInput: boolean;
    onHttpMethodChange: (value: string) => void;
}

const HttpConfigForm: React.FC<IHttpConfigFormProps> = ({ showBodyInput, onHttpMethodChange }) => {
    return (
        <>
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
        </>
    );
};

export default HttpConfigForm;