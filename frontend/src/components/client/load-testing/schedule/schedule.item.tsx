import React from 'react';
import { List, Button, Switch, Typography, Tag, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type {ISchedule} from './type.schedule';
import dayjs from 'dayjs';

interface IScheduleItemProps {
    schedule: ISchedule;
    onDelete: (id: string) => void;
    onToggle: (id: string) => void;
    onEdit: (schedule: ISchedule) => void;
}

const { Text } = Typography;

const ScheduleItem: React.FC<IScheduleItemProps> = (props: IScheduleItemProps) => {
    const {
        schedule,
        onDelete,
        onToggle,
        onEdit
    } = props;
    return (
        <List.Item
            actions={[
                <Switch
                    key="toggle"
                    checked={schedule.enabled}
                    onChange={() => onToggle(schedule.id)}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                />,
                <Tooltip title="Edit Schedule" key="edit">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(schedule)}
                    />
                </Tooltip>,
                <Tooltip title="Delete Schedule" key="delete">
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(schedule.id)}
                    />
                </Tooltip>
            ]}
        >
            <List.Item.Meta
                title={
                    <Space>
                        {schedule.name}
                        <Tag color={schedule.enabled ? "green" : "default"}>
                            {schedule.enabled ? "Active" : "Inactive"}
                        </Tag>
                        <Tag color={schedule.type === 'ONCE' ? "blue" : "purple"}>
                            {schedule.type === 'ONCE' ? "One-time" : "Recurring"}
                        </Tag>
                    </Space>
                }
                description={
                    <>
                        <div>{schedule.description}</div>
                        <div>
                            <Text type="secondary">Test Plan: {schedule.testPlanTitle}</Text>
                        </div>
                        {schedule.type === 'ONCE' ? (
                            <div>
                                <ClockCircleOutlined /> Execution time: {dayjs(schedule.executionTime).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                        ) : (
                            <div>
                                <ClockCircleOutlined /> Cron Expression: {schedule.cronExpression}
                            </div>
                        )}
                        {schedule.nextRunTime && (
                            <div>
                                <Text type="secondary">Next run: {dayjs(schedule.nextRunTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                            </div>
                        )}
                    </>
                }
            />
        </List.Item>
    );
};

export default ScheduleItem;