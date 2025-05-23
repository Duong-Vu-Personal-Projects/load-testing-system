import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Modal, Typography } from 'antd';
import {EScheduleType, type IRequestCreateSchedule} from "./type.schedule.tsx";
import CronHelper from "./cron.helper.tsx";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface IScheduleFormProps {
    testPlanId: string;
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: IRequestCreateSchedule) => Promise<void>;
    confirmLoading: boolean;
}

const ScheduleForm: React.FC<IScheduleFormProps> = ({
                                                        testPlanId,
                                                        visible,
                                                        onCancel,
                                                        onSubmit,
                                                        confirmLoading
                                                    }) => {
    const [form] = Form.useForm();
    const [scheduleType, setScheduleType] = useState<EScheduleType>(EScheduleType.ONCE);

    const handleTypeChange = (value: EScheduleType) => {
        setScheduleType(value);
        // Clear fields that are not relevant to the current type
        if (value === EScheduleType.ONCE) {
            form.setFieldsValue({ cronExpression: undefined });
        } else {
            form.setFieldsValue({ executionTime: undefined });
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Create the request object
            const request: IRequestCreateSchedule = {
                testPlanId,
                name: values.name,
                type: values.type,
                description: values.description,
            };

            // For ONCE type, preserve local time
            if (values.type === EScheduleType.ONCE && values.executionTime) {
                // Format date in local timezone instead of using toISOString()
                const localDate = values.executionTime;

                // Create ISO string but remove the 'Z' to indicate it's local time
                // This formatted date will be interpreted as local time by the backend
                request.executionTime = localDate.format('YYYY-MM-DDTHH:mm:ss');
            } else if (values.cronExpression) {
                request.cronExpression = values.cronExpression;
            }

            await onSubmit(request);
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    // Helper to set cron expression from the helper component
    const handleCronExpressionChange = (cronExpression: string) => {
        form.setFieldsValue({ cronExpression });
    };

    return (
        <Modal
            title="Create Schedule"
            open={visible}
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ type: EScheduleType.ONCE }}
            >
                <Form.Item
                    name="name"
                    label="Schedule Name"
                    rules={[{ required: true, message: 'Please enter a name' }]}
                >
                    <Input placeholder="Enter schedule name" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Schedule Type"
                    rules={[{ required: true, message: 'Please select a type' }]}
                >
                    <Select onChange={(value) => handleTypeChange(value as EScheduleType)}>
                        <Option value={EScheduleType.ONCE}>One-time execution</Option>
                        <Option value={EScheduleType.RECURRING}>Recurring (Cron)</Option>
                    </Select>
                </Form.Item>

                {scheduleType === EScheduleType.ONCE ? (
                    <Form.Item
                        name="executionTime"
                        label="Execution Time"
                        rules={[{ required: true, message: 'Please select execution time' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Select date and time"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        name="cronExpression"
                        label="Cron Expression"
                        rules={[{ required: true, message: 'Please enter cron expression' }]}
                        extra={
                            <div>
                                <div>Examples:</div>
                                <div>- Every day at 8:00 AM: <Text code>0 0 8 * * *</Text></div>
                                <div>- Every Monday at 9:00 AM: <Text code>0 0 9 * * MON</Text></div>
                                <div>- Every 30 minutes: <Text code>0 */30 * * * *</Text></div>
                                <CronHelper onChange={handleCronExpressionChange} />
                            </div>
                        }
                    >
                        <Input placeholder="Enter cron expression" />
                    </Form.Item>
                )}

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea rows={3} placeholder="Enter description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleForm;