import React from 'react';
import { Button, Card, Space, Tag, Popconfirm, Typography } from 'antd';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {EScheduleType, type ISchedule} from "./type.schedule.tsx";
import utc from 'dayjs/plugin/utc';
const { Text } = Typography;
dayjs.extend(utc);
interface IScheduleItemProps {
    schedule: ISchedule;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
}

const ScheduleItem: React.FC<IScheduleItemProps> = ({ schedule, onDelete, onToggle }) => {
    return (
        <Card
            style={{ marginBottom: 16 }}
            title={
                <Space>
                    <ClockCircleOutlined />
                    <span>{schedule.name}</span>
                    <Tag color={schedule.enabled ? 'green' : 'red'}>
                        {schedule.enabled ? 'Enabled' : 'Disabled'}
                    </Tag>
                </Space>
            }
            extra={
                <Popconfirm
                    title="Are you sure you want to delete this schedule?"
                    onConfirm={() => onDelete(schedule.id)}
                    okText="Yes"
                    cancelText="No"
                    placement="topRight"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Text strong>Type: </Text>
                    <Tag color={schedule.type === EScheduleType.ONCE ? 'blue' : 'green'}>
                        {schedule.type === EScheduleType.ONCE ? 'One-time' : 'Recurring'}
                    </Tag>
                </div>

                {schedule.type === EScheduleType.ONCE ? (
                    <div>
                        <Text strong>Execution time: </Text>
                        <Text>{schedule.executionTime ? dayjs(schedule.executionTime).format('YYYY-MM-DD HH:mm:ss') : 'Not set'}</Text>
                    </div>
                ) : (
                    <div>
                        <Text strong>Cron expression: </Text>
                        <Text code>{schedule.cronExpression}</Text>
                    </div>
                )}

                <div>
                    <Text strong>Next run: </Text>
                    <Text>{schedule.nextRunTime ? dayjs(schedule.nextRunTime).format('YYYY-MM-DD HH:mm:ss') : 'Not scheduled'}</Text>
                </div>

                {schedule.lastRunTime && (
                    <div>
                        <Text strong>Last run: </Text>
                        <Text>{dayjs(schedule.lastRunTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </div>
                )}

                {schedule.description && (
                    <div>
                        <Text strong>Description: </Text>
                        <Text>{schedule.description}</Text>
                    </div>
                )}

                <Button
                    type={schedule.enabled ? 'default' : 'primary'}
                    onClick={() => onToggle(schedule.id)}
                >
                    {schedule.enabled ? 'Disable' : 'Enable'}
                </Button>
            </Space>
        </Card>
    );
};

export default ScheduleItem;