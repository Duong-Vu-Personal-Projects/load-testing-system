import React from 'react';
import {Form, Input, InputNumber, Button, Card, Space, Switch, Divider, Typography} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { IThreadStageGroup } from './type.test.plan';
import AutoStopPresets from "./auto-stop/auto.stop.preset.tsx";
import AutoStopConfig from './auto-stop/auto.stop.config';

const { Text } = Typography;
const ThreadGroupForm: React.FC = () => {
    const defaultThreadGroup: IThreadStageGroup = {
        url: 'https://',
        rampDuration: 0,
        holdDuration: 0,
        rampToThreads: 5,
        throughputTimer: 0,
        holdIteration: 2,
        followRedirects: true
    };
    const form = Form.useFormInstance();
    return (
        <Form.List name="threadStageGroups">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Card
                            key={key}
                            title={`Thread Group ${name + 1}`}
                            extra={
                                fields.length > 1 ? (
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => remove(name)}
                                    />
                                ) : null
                            }
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
                            {/* Add Auto-Stop Configuration */}
                            <Divider orientation="left">Auto-Stop Configuration</Divider>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text type="secondary">
                                    Configure conditions that will automatically stop the test when met
                                </Text>

                                <AutoStopPresets
                                    onApplyPreset={(preset) => {
                                        // Define a correctly typed function to set field values
                                        const applyPreset = () => {
                                            // Convert name to string to avoid type issues
                                            const nameStr = name.toString();
                                            form.setFieldsValue({
                                                threadStageGroups: {
                                                    [nameStr]: {
                                                        autoStop: preset
                                                    }
                                                }
                                            });
                                        };
                                        applyPreset();
                                    }}
                                />
                            </div>

                            <AutoStopConfig namePrefix={["threadStageGroups", name.toString(), 'autoStop']} />
                        </Card>
                    ))}

                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add(defaultThreadGroup)}
                            block
                            icon={<PlusOutlined />}
                        >
                            Add Thread Stage Group
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
};

export default ThreadGroupForm;