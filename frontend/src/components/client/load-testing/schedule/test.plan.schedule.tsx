import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, App, Divider } from 'antd';
import { PlusOutlined, ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import type {IRequestCreateSchedule, IRequestEditSchedule, ISchedule} from './type.schedule';
import {
    createScheduleAPI,
    deleteScheduleAPI,
    getSchedulesByTestPlanAPI,
    toggleScheduleStatusAPI,
    searchSchedulesByNameAPI,
    searchSchedulesByStatusAPI,
    searchSchedulesByExecutionTimeAPI,
    updateScheduleAPI
} from '../../../../services/api';
import ScheduleList from "./schedule.list.tsx";
import NoSchedules from "./no.schedule.tsx";
import ScheduleForm from "./schedule.form.tsx";
import { AdvancedSearchBar } from '../../../shared/advanced.search.bar';
import dayjs from "dayjs";

const { Title } = Typography;

const TestPlanSchedule: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { notification } = App.useApp();
    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [currentEditSchedule, setCurrentEditSchedule] = useState<ISchedule | null>(null);
    const [searchActive, setSearchActive] = useState(false);
    const [searchByName, setSearchByName] = useState('');
    const [searchByStatus, setSearchByStatus] = useState<boolean | undefined>(undefined);
    const [searchByDateRange, setSearchByDateRange] = useState<[string, string] | null>(null);

    useEffect(() => {
        fetchSchedules();
    }, [id, pagination.current, pagination.pageSize]);
    const handleEditSchedule = (schedule: ISchedule) => {
        setCurrentEditSchedule(schedule);
        setIsModalVisible(true);
    };
    const fetchSchedules = async (overrides?: {
        isActive?: boolean,
        nameFilter?: string,
        statusFilter?: boolean | undefined,
        dateRangeFilter?: [string, string] | null
    }) => {
        if (!id) return;

        try {
            setLoading(true);
            let response;

            // Sử dụng giá trị ghi đè nếu có, nếu không thì dùng state
            const isActive = overrides?.isActive !== undefined ? overrides.isActive : searchActive;
            const name = overrides?.nameFilter !== undefined ? overrides.nameFilter : searchByName;
            const status = overrides?.statusFilter !== undefined ? overrides.statusFilter : searchByStatus;
            const dateRange = overrides?.dateRangeFilter !== undefined ? overrides.dateRangeFilter : searchByDateRange;

            if (isActive) {
                if (status !== undefined) {
                    response = await searchSchedulesByStatusAPI(
                        id,
                        status,
                        pagination.current,
                        pagination.pageSize
                    );
                } else if (dateRange && dateRange[0] && dateRange[1]) {
                    response = await searchSchedulesByExecutionTimeAPI(
                        id,
                        dateRange[0],
                        dateRange[1],
                        pagination.current,
                        pagination.pageSize
                    );
                } else if (name) {
                    // Search by name
                    response = await searchSchedulesByNameAPI(
                        id,
                        name,
                        pagination.current,
                        pagination.pageSize
                    );
                } else {
                    // If all search criteria are empty, revert to regular fetch
                    response = await getSchedulesByTestPlanAPI(
                        id,
                        pagination.current,
                        pagination.pageSize
                    );
                }
            } else {
                // Regular fetch without search
                response = await getSchedulesByTestPlanAPI(
                    id,
                    pagination.current,
                    pagination.pageSize
                );
            }

            // Xử lý response giống như trước
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

// Cập nhật hàm handleStatusSearch
    const handleStatusSearch = (enabled: boolean) => {
        // Cập nhật state cho UI
        setSearchByStatus(enabled);
        setSearchByName('');
        setSearchByDateRange(null);
        setSearchActive(true);
        setPagination(prev => ({ ...prev, current: 1 }));

        // Gọi fetchSchedules với tham số trực tiếp
        fetchSchedules({
            isActive: true,
            nameFilter: '',
            statusFilter: enabled,
            dateRangeFilter: null
        });
    };

// Cập nhật hàm resetSearch
    const resetSearch = () => {
        // Cập nhật state cho UI
        setSearchActive(false);
        setSearchByName('');
        setSearchByStatus(undefined);
        setSearchByDateRange(null);
        setPagination(prev => ({ ...prev, current: 1 }));

        // Gọi API trực tiếp thay vì dùng fetchSchedules
        if (!id) return;

        setLoading(true);
        getSchedulesByTestPlanAPI(id, 1, pagination.pageSize)
            .then(response => {
                if (response && response.data) {
                    setSchedules(response.data.result);
                    setPagination(prev => ({
                        ...prev,
                        current: 1,
                        total: response.data.meta.total
                    }));
                }
            })
            .catch(error => {
                notification.error({
                    message: 'Error loading schedules',
                    description: 'An error occurred while fetching schedules'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    // Cập nhật hàm handleNameSearch
    const handleNameSearch = (value: string) => {
        // Cập nhật state cho UI
        setSearchByName(value);
        setSearchByStatus(undefined);
        setSearchByDateRange(null);
        setSearchActive(!!value);
        setPagination(prev => ({ ...prev, current: 1 }));

        // Gọi fetchSchedules với tham số trực tiếp
        fetchSchedules({
            isActive: !!value,
            nameFilter: value,
            statusFilter: undefined,
            dateRangeFilter: null
        });
    };

    const handleDateRangeSearch = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        if (start && end) {
            const startStr = start.format('YYYY-MM-DDTHH:mm:ss');
            const endStr = end.format('YYYY-MM-DDTHH:mm:ss');
            setSearchByDateRange([startStr, endStr]);
            setSearchByName('');
            setSearchByStatus(undefined);
            setSearchActive(true);
            setPagination(prev => ({ ...prev, current: 1 }));

            fetchSchedules({
                isActive: true,
                nameFilter: '',
                statusFilter: undefined,
                dateRangeFilter: [startStr, endStr]
            });
        }
    };
    const handleFormSubmit = async (values: IRequestCreateSchedule) => {
        try {
            setConfirmLoading(true);
            let response;

            if (currentEditSchedule) {
                const newValues : IRequestEditSchedule = {
                    id: currentEditSchedule.id,
                    ...values
                };
                response = await updateScheduleAPI(newValues);
                if (response && response.data) {
                    notification.success({
                        message: 'Schedule Updated',
                        description: `Schedule "${values.name}" updated successfully`
                    });
                    setIsModalVisible(false);
                    setCurrentEditSchedule(null);
                    fetchSchedules();
                } else {
                    notification.error({
                        message: 'Failed to update schedule',
                        description: response?.message || 'Unknown error occurred'
                    });
                }
            } else {
                // Create new schedule
                response = await createScheduleAPI(values);
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
            }
        } catch (error) {
            notification.error({
                message: currentEditSchedule ? 'Error updating schedule' : 'Error creating schedule',
                description: `An error occurred while ${currentEditSchedule ? 'updating' : 'creating'} the schedule`
            });
            console.error(`Error ${currentEditSchedule ? 'updating' : 'creating'} schedule:`, error);
        } finally {
            setConfirmLoading(false);
        }
    };
    const handleModalCancel = () => {
        setIsModalVisible(false);
        setCurrentEditSchedule(null);
    };
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
                        onClick={() => {
                            setCurrentEditSchedule(null);
                            setIsModalVisible(true);
                        }}
                    >
                        Create Schedule
                    </Button>
                </Space>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: 16 }}>
                <Divider orientation="left">Search Schedules</Divider>
                <AdvancedSearchBar
                    onSearch={handleNameSearch}
                    onStatusSearch={handleStatusSearch}
                    onDateRangeSearch={handleDateRangeSearch}
                    placeholder="Search schedules by name..."
                    allowClear={true}
                    showDateFilter={true}
                    showStatusFilter={true}
                />
            </div>

            {/* Show active search filters */}
            {searchActive && (
                <div style={{ marginBottom: 16, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <Space>
                        <strong>Active Filters:</strong>

                        {searchByName && (
                            <span style={{ padding: '2px 8px', backgroundColor: '#e6f7ff', borderRadius: 4 }}>
                                Name: {searchByName}
                            </span>
                        )}

                        {searchByStatus !== undefined && (
                            <span style={{ padding: '2px 8px', backgroundColor: '#f9f0ff', borderRadius: 4 }}>
                                Status: {searchByStatus ? 'Enabled' : 'Disabled'}
                            </span>
                        )}

                        {searchByDateRange && searchByDateRange[0] && searchByDateRange[1] && (
                            <span style={{ padding: '2px 8px', backgroundColor: '#f6ffed', borderRadius: 4 }}>
                                Date Range: {new Date(searchByDateRange[0]).toLocaleDateString()} to {new Date(searchByDateRange[1]).toLocaleDateString()}
                            </span>
                        )}

                        <Button size="small" onClick={resetSearch}>Clear Filters</Button>
                    </Space>
                </div>
            )}

            {/* Show list or empty state */}
            {schedules.length > 0 ? (
                <ScheduleList
                    schedules={schedules}
                    loading={loading}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    onDeleteSchedule={handleDeleteSchedule}
                    onToggleStatus={handleToggleStatus}
                    onEditSchedule={handleEditSchedule}
                />
            ) : loading ? (
                <div style={{ textAlign: 'center', padding: 24 }}>
                    Loading schedules...
                </div>
            ) : searchActive ? (
                <div style={{ textAlign: 'center', padding: 24 }}>
                    <p>No schedules found matching your search criteria.</p>
                    <Button onClick={resetSearch}>Clear Search</Button>
                </div>
            ) : (
                <NoSchedules onCreateClick={() => {
                    setCurrentEditSchedule(null);
                    setIsModalVisible(true);
                }} />
            )}

            {/* Schedule form modal (Create or Edit) */}
            <ScheduleForm
                testPlanId={id || ''}
                visible={isModalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleFormSubmit}
                confirmLoading={confirmLoading}
                editSchedule={currentEditSchedule}
                title={currentEditSchedule ? "Edit Schedule" : "Create Schedule"}
            />
        </Card>
    );
};

export default TestPlanSchedule;