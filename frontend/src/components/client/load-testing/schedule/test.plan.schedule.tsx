import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, App } from 'antd';
import { PlusOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import type {IRequestCreateSchedule, ISchedule} from './type.schedule';
import {
    createScheduleAPI,
    deleteScheduleAPI,
    getSchedulesByTestPlanAPI,
    toggleScheduleStatusAPI
} from '../../../../services/api';
import ScheduleList from "./schedule.list.tsx";
import NoSchedules from "./no.schedule.tsx";
import ScheduleForm from "./schedule.form.tsx";


const { Title } = Typography;

const TestPlanSchedule: React.FC = () => {
    // Get testPlanId from URL params
    const { id } = useParams<{ id: string }>();
    const { notification } = App.useApp();

    // State variables
    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Fetch schedules on component mount and when pagination changes
    useEffect(() => {
        fetchSchedules();
    }, [id, pagination.current, pagination.pageSize]);

    // Function to fetch schedules
    const fetchSchedules = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await getSchedulesByTestPlanAPI(
                id,
                pagination.current,
                pagination.pageSize
            );

            if (response && response.data) {
                setSchedules(response.data.result);
                setPagination({
                    ...pagination,
                    total: response.data.meta.total
                });
            } else {
                notification.error({
                    message: 'Failed to load schedules',
                    description: response?.message || 'Unknown error occurred'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error loading schedules',
                description: 'An error occurred while fetching schedules'
            });
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to create a new schedule
    const handleCreateSchedule = async (values: IRequestCreateSchedule) => {
        try {
            setConfirmLoading(true);
            const response = await createScheduleAPI(values);

            if (response && response.data) {
                notification.success({
                    message: 'Schedule Created',
                    description: `Schedule "${values.name}" created successfully`
                });
                setIsModalVisible(false);
                fetchSchedules();
            } else {
                notification.error({
                    message: 'Failed to create schedule',
                    description: response?.message || 'Unknown error occurred'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error creating schedule',
                description: 'An error occurred while creating the schedule'
            });
            console.error('Error creating schedule:', error);
        } finally {
            setConfirmLoading(false);
        }
    };

    // Function to toggle schedule status
    const handleToggleStatus = async (scheduleId: string) => {
        try {
            const response = await toggleScheduleStatusAPI(scheduleId);

            if (response && response.data) {
                notification.success({
                    message: 'Schedule Updated',
                    description: 'Schedule status toggled successfully'
                });
                fetchSchedules();
            } else {
                notification.error({
                    message: 'Failed to update schedule',
                    description: response?.message || 'Unknown error occurred'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error updating schedule',
                description: 'An error occurred while updating the schedule'
            });
            console.error('Error updating schedule:', error);
        }
    };

    // Function to delete a schedule
    const handleDeleteSchedule = async (scheduleId: string) => {
        try {
            const response = await deleteScheduleAPI(scheduleId);

            if (response) {
                notification.success({
                    message: 'Schedule Deleted',
                    description: 'Schedule deleted successfully'
                });
                fetchSchedules();
            } else {
                notification.error({
                    message: 'Failed to delete schedule',
                    description: response?.message || 'Unknown error occurred'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error deleting schedule',
                description: 'An error occurred while deleting the schedule'
            });
            console.error('Error deleting schedule:', error);
        }
    };

    // Function to handle pagination changes
    const handlePaginationChange = (page: number, pageSize: number) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize
        });
    };

    return (
        <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4}>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    Test Plan Schedules
                </Title>
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchSchedules}
                    >
                        Refresh
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Create Schedule
                    </Button>
                </Space>
            </div>

            {/* Show list or empty state */}
            {schedules.length > 0 ? (
                <ScheduleList
                    schedules={schedules}
                    loading={loading}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    onDeleteSchedule={handleDeleteSchedule}
                    onToggleStatus={handleToggleStatus}
                />
            ) : (
                <NoSchedules onCreateClick={() => setIsModalVisible(true)} />
            )}

            {/* Schedule creation modal */}
            <ScheduleForm
                testPlanId={id || ''}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleCreateSchedule}
                confirmLoading={confirmLoading}
            />
        </Card>
    );
};

export default TestPlanSchedule;