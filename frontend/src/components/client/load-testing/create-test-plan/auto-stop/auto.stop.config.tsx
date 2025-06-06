import React from 'react';
import { Form, Switch, Input, Button, Card, Typography, Divider } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
    AutoStopMetricTypes,
    AutoStopAggregations,
    AutoStopComparisons
} from '../type.test.plan';
import AutoStopCondition from './auto.stop.condition';

const { Text } = Typography;

interface AutoStopConfigProps {
    namePrefix: string | string[]; // Accept either a string or an array of strings
}

const AutoStopConfig: React.FC<AutoStopConfigProps> = ({ namePrefix }) => {
    // Convert namePrefix to an array if it's a string
    const namePrefixArray = Array.isArray(namePrefix) ? namePrefix : [namePrefix];

    // Use the array form to properly watch the field
    const isEnabled = Form.useWatch([...namePrefixArray, 'enabled'], Form.useFormInstance());

    // Default condition template
    const defaultCondition = {
        metricType: AutoStopMetricTypes.LATENCY_TIME,
        aggregation: AutoStopAggregations.MAX,
        comparison: AutoStopComparisons.GREATER_THAN_OR_EQUAL,
        thresholdValue: 1000 // 1000ms = 1 second
    };

    return (
        <Card
            title={<Text strong>Auto-Stop Configuration</Text>}
            extra={
                <Form.Item
                    name={[...namePrefixArray, 'enabled']}
                    valuePropName="checked"
                    initialValue={false}
                    noStyle
                >
                    <Switch
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"
                    />
                </Form.Item>
            }
            style={{ marginBottom: 16 }}
        >
            {isEnabled && (
                <>
                    <Text type="secondary">
                        <InfoCircleOutlined style={{ marginRight: 8 }} />
                        Auto-stop will terminate the test when any of the defined conditions are met.
                    </Text>

                    <Form.Item
                        name={[...namePrefixArray, 'name']}
                        label="Configuration Name"
                        tooltip="Optional name for this auto-stop configuration"
                    >
                        <Input placeholder="e.g., High Latency Stop" />
                    </Form.Item>

                    <Form.Item
                        name={[...namePrefixArray, 'samplePattern']}
                        label="Sample Pattern"
                        tooltip="Optional regex pattern to filter which samples are considered for auto-stop conditions"
                    >
                        <Input placeholder="e.g., .*login.*" />
                    </Form.Item>

                    <Divider orientation="left">Conditions</Divider>

                    <Form.List name={[...namePrefixArray, 'conditions']}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <AutoStopCondition
                                        key={field.key}
                                        index={index}
                                        remove={remove}
                                        // Make sure to convert field.name to string when used in arrays
                                        namePrefix={[...namePrefixArray, 'conditions', field.name.toString()]}
                                    />
                                ))}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add(defaultCondition)}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Add Condition
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </>
            )}

            {!isEnabled && (
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <Text type="secondary">Enable auto-stop to configure conditions</Text>
                </div>
            )}
        </Card>
    );
};

export default AutoStopConfig;