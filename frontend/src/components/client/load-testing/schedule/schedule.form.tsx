import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Modal } from 'antd';
import { EScheduleType, type IRequestCreateSchedule, type ISchedule } from "./type.schedule.tsx";
import CronHelper from "./cron.helper.tsx";
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;


interface IScheduleFormProps {
    testPlanId: string;
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: IRequestCreateSchedule) => Promise<void>;
    confirmLoading: boolean;
    editSchedule?: ISchedule | null; // New prop for editing
    title?: string; // Custom title for the modal
}

const ScheduleForm: React.FC<IScheduleFormProps> = (props: IScheduleFormProps) => {
    const {
        testPlanId,
        visible,
        onCancel,
        onSubmit,
        confirmLoading,
        editSchedule,
        title = editSchedule ? "Edit Schedule" : "Create Schedule"
    } = props;

    const [form] = Form.useForm();
    const [scheduleType, setScheduleType] = useState<EScheduleType>(
        editSchedule ? editSchedule.type : EScheduleType.ONCE
    );

    // Initialize form when editing or reset when creating
    useEffect(() => {
        if (visible) {
            if (editSchedule) {
                // Fill form with existing schedule data
                form.setFieldsValue({
                    name: editSchedule.name,
                    type: editSchedule.type,
                    description: editSchedule.description,
                    // For ONCE type, convert execution time to dayjs object
                    executionTime: editSchedule.type === EScheduleType.ONCE && editSchedule.executionTime
                        ? dayjs(editSchedule.executionTime)
                        : undefined,
                    cronExpression: editSchedule.type === EScheduleType.RECURRING
                        ? editSchedule.cronExpression
                        : undefined
                });
                setScheduleType(editSchedule.type);
            } else {
                // Reset form for creation
                form.resetFields();
                setScheduleType(EScheduleType.ONCE);
            }
        }
    }, [visible, editSchedule, form]);

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
                request.executionTime = values.executionTime.format('YYYY-MM-DDTHH:mm:ss');
            } else if (values.cronExpression) {
                request.cronExpression = values.cronExpression;
            }

            await onSubmit(request);
            if (!editSchedule) { // Only reset on creation
                form.resetFields();
            }
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
            title={title}
            open={visible}
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ type: scheduleType }}
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
                    <Select onChange={handleTypeChange}>
                        <Option value={EScheduleType.ONCE}>One Time</Option>
                        <Option value={EScheduleType.RECURRING}>Recurring</Option>
                    </Select>
                </Form.Item>

                {scheduleType === EScheduleType.ONCE ? (
                    <Form.Item
                        name="executionTime"
                        label="Execution Time"
                        rules={[{ required: true, message: 'Please select an execution time' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Select date and time"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                ) : (
                    <>
                        <Form.Item
                            name="cronExpression"
                            label="Cron Expression"
                            rules={[{ required: true, message: 'Please enter a cron expression' }]}
                            help="Example: 0 0 12 * * ? (daily at noon)"
                        >
                            <Input placeholder="Enter cron expression" />
                        </Form.Item>
                        <CronHelper onChange={handleCronExpressionChange} />
                    </>
                )}

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea rows={3} placeholder="Enter schedule description (optional)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScheduleForm;