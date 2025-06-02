import React, { useState } from 'react';
import { Button, Space, DatePicker } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import type {ISearchBarProps} from "./search.bar.tsx";

const { RangePicker } = DatePicker;

interface ITimeSearchBarProps extends ISearchBarProps {
    onDateRangeSearch?: (start: string, end: string) => void;
    showDateFilter?: boolean;
}

export const TimeSearchBar: React.FC<ITimeSearchBarProps> = (props: ITimeSearchBarProps) => {
    const {
        onDateRangeSearch,
        allowClear = true,
        showDateFilter = false,
    } = props;

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const handleDateRangeSearch = () => {
        if (dateRange && dateRange[0] && dateRange[1] && onDateRangeSearch) {
            onDateRangeSearch(
                dateRange[0].toISOString(),
                dateRange[1].toISOString()
            );
        } else if (onDateRangeSearch) {
            onDateRangeSearch('', '');
        }
    };

    const handleClear = () => {
        setDateRange(null);
        if (onDateRangeSearch) {
            onDateRangeSearch('', '');
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap>
                {showDateFilter && onDateRangeSearch && (
                    <>
                        <RangePicker
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
                            showTime
                            style={{ width: 350 }}
                        />
                        <Button type="primary" onClick={handleDateRangeSearch}>
                            Filter by Date
                        </Button>
                    </>
                )}

                {allowClear && (
                    <Button onClick={handleClear}>
                        <ClearOutlined /> Clear All Filters
                    </Button>
                )}
            </Space>
        </Space>
    );
};