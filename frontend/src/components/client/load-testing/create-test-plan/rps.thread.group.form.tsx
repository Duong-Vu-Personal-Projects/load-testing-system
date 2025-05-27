import React from 'react';
import {Form, Input, InputNumber, Button, Card, Space, Switch} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface IRpsThreadGroupFormProps {
    // No specific props needed as it uses Form.List context
}

const RpsThreadGroupForm: React.FC<IRpsThreadGroupFormProps> = () => {
    const defaultRpsThreadGroup: IRpsThreadGroupFormProps = {
        url: 'https://',
        rampDuration: 0,
        holdDuration: 0,
        rampToThreads: 10,
        throughputTimer: 0,
        maxThreads: 5,
        followRedirects: true
    };

    return (
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
                            <Form.Item
                                name={[name, 'followRedirects']}
                                label="Follow Redirects"
                                valuePropName="checked"
                            >
                                <Switch />
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
                            onClick={() => add(defaultRpsThreadGroup)}
                            block
                            icon={<PlusOutlined />}
                        >
                            Add RPS Thread Stage Group
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
};

export default RpsThreadGroupForm;