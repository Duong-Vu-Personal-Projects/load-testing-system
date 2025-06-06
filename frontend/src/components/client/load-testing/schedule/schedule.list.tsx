import React from 'react';
import { List, Pagination } from 'antd';
import type { ISchedule } from './type.schedule';
import ScheduleItem from "./schedule.item.tsx";

interface IScheduleListProps {
    schedules: ISchedule[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onPaginationChange: (page: number, pageSize: number) => void;
    onDeleteSchedule: (id: string) => void;
    onToggleStatus: (id: string) => void;
    onEditSchedule: (schedule: ISchedule) => void;
}

const ScheduleList: React.FC<IScheduleListProps> = (props: IScheduleListProps) => {
    const {
        schedules,
        loading,
        pagination,
        onPaginationChange,
        onDeleteSchedule,
        onToggleStatus,
        onEditSchedule
    } = props;
    return (
        <div>
            <List
                loading={loading}
                dataSource={schedules}
                renderItem={(schedule) => (
                    <ScheduleItem
                        key={schedule.id}
                        schedule={schedule}
                        onDelete={onDeleteSchedule}
                        onToggle={onToggleStatus}
                        onEdit = {onEditSchedule}
                    />
                )}
            />

            {pagination.total > 0 && (
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={onPaginationChange}
                    showSizeChanger
                    showTotal={(total) => `Total ${total} schedules`}
                    style={{ marginTop: 16, textAlign: 'right' }}
                />
            )}
        </div>
    );
};

export default ScheduleList;