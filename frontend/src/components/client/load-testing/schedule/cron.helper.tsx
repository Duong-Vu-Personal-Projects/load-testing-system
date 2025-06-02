import React, { useState } from 'react';
import { Modal, Button, Form, Select, InputNumber, Radio, Space, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

interface ICronHelperProps {
    onChange: (cronExpression: string) => void;
}

const CronHelper: React.FC<ICronHelperProps> = (props: ICronHelperProps) => {
    const {onChange} = props;
    const [isVisible, setIsVisible] = useState(false);
    const [frequencyType, setFrequencyType] = useState('daily');
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then(values => {
            let cronExpression = '';

            // Format: second minute hour day-of-month month day-of-week
            switch (frequencyType) {
                case 'daily':
                    // Run daily at specified time
                    cronExpression = `0 ${values.minute} ${values.hour} * * *`;
                    break;
                case 'weekly':
                    // Run weekly on specified day at specified time
                    cronExpression = `0 ${values.minute} ${values.hour} * * ${values.weekday}`;
                    break;
                case 'monthly':
                    // Run monthly on specified day at specified time
                    cronExpression = `0 ${values.minute} ${values.hour} ${values.dayOfMonth} * *`;
                    break;
                case 'interval':
                    // Run every X minutes/hours
                    if (values.intervalUnit === 'minute') {
                        cronExpression = `0 */${values.intervalValue} * * * *`;
                    } else {
                        cronExpression = `0 0 */${values.intervalValue} * * *`;
                    }
                    break;
            }

            onChange(cronExpression);
            setIsVisible(false);
        });
    };

    return (
        <>
            <Button
                type="link"
                icon={<QuestionCircleOutlined />}
                onClick={() => setIsVisible(true)}
            >
                Help me build a cron expression
            </Button>

            <Modal
                title="Cron Expression Builder"
                open={isVisible}
                onOk={handleOk}
                onCancel={() => setIsVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        frequencyType: 'daily',
                        hour: 9,
                        minute: 0,
                        weekday: 'MON',
                        dayOfMonth: 1,
                        intervalValue: 30,
                        intervalUnit: 'minute'
                    }}
                >
                    <Form.Item name="frequencyType" label="Frequency">
                        <Radio.Group onChange={(e) => setFrequencyType(e.target.value)}>
                            <Radio.Button value="daily">Daily</Radio.Button>
                            <Radio.Button value="weekly">Weekly</Radio.Button>
                            <Radio.Button value="monthly">Monthly</Radio.Button>
                            <Radio.Button value="interval">Interval</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {frequencyType === 'daily' && (
                        <Space>
                            <Form.Item name="hour" label="Hour">
                                <InputNumber min={0} max={23} />
                            </Form.Item>
                            <Form.Item name="minute" label="Minute">
                                <InputNumber min={0} max={59} />
                            </Form.Item>
                            <Text type="secondary">Will run daily at this time</Text>
                        </Space>
                    )}

                    {frequencyType === 'weekly' && (
                        <>
                            <Form.Item name="weekday" label="Day of Week">
                                <Select style={{ width: 120 }}>
                                    <Option value="MON">Monday</Option>
                                    <Option value="TUE">Tuesday</Option>
                                    <Option value="WED">Wednesday</Option>
                                    <Option value="THU">Thursday</Option>
                                    <Option value="FRI">Friday</Option>
                                    <Option value="SAT">Saturday</Option>
                                    <Option value="SUN">Sunday</Option>
                                </Select>
                            </Form.Item>
                            <Space>
                                <Form.Item name="hour" label="Hour">
                                    <InputNumber min={0} max={23} />
                                </Form.Item>
                                <Form.Item name="minute" label="Minute">
                                    <InputNumber min={0} max={59} />
                                </Form.Item>
                            </Space>
                        </>
                    )}

                    {frequencyType === 'monthly' && (
                        <>
                            <Form.Item name="dayOfMonth" label="Day of Month">
                                <InputNumber min={1} max={31} />
                            </Form.Item>
                            <Space>
                                <Form.Item name="hour" label="Hour">
                                    <InputNumber min={0} max={23} />
                                </Form.Item>
                                <Form.Item name="minute" label="Minute">
                                    <InputNumber min={0} max={59} />
                                </Form.Item>
                            </Space>
                        </>
                    )}

                    {frequencyType === 'interval' && (
                        <Space>
                            <Text>Every</Text>
                            <Form.Item name="intervalValue" noStyle>
                                <InputNumber min={1} max={59} />
                            </Form.Item>
                            <Form.Item name="intervalUnit" noStyle>
                                <Select style={{ width: 100 }}>
                                    <Option value="minute">Minutes</Option>
                                    <Option value="hour">Hours</Option>
                                </Select>
                            </Form.Item>
                        </Space>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default CronHelper;