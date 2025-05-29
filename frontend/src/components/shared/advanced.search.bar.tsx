import React, { useState } from 'react';
import { Input, Button, Space, DatePicker } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';
import type {ISearchBarProps} from "./search.bar.tsx";

const { RangePicker } = DatePicker;

interface IAdvancedSearchBarProps extends ISearchBarProps {
    onDateRangeSearch?: (start: string, end: string) => void;
    onStatusSearch?: (enabled: boolean) => void;
    showDateFilter?: boolean;
    showStatusFilter?: boolean;
}

export const AdvancedSearchBar: React.FC<IAdvancedSearchBarProps> = (props: IAdvancedSearchBarProps) => {
    const {
        onSearch,
        onDateRangeSearch,
        onStatusSearch,
        placeholder = "Search...",
        allowClear = true,
        showDateFilter = false,
        showStatusFilter = false,
    } = props;

    const [searchText, setSearchText] = useState<string>('');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [status, setStatus] = useState<boolean | null>(null);

    const handleSearch = () => {
        onSearch(searchText);
    };

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
        setSearchText('');
        setDateRange(null);
        setStatus(null);
        onSearch('');
        if (onDateRangeSearch) {
            onDateRangeSearch('', '');
        }
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap>
                <Input
                    placeholder={placeholder}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ width: 250 }}
                    prefix={<SearchOutlined />}
                    allowClear={allowClear}
                />
                <Button type="primary" onClick={handleSearch}>
                    Search Title
                </Button>

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

            {showStatusFilter && onStatusSearch && (
                <Space>
                    <span>Status:</span>
                    <Button
                        type={status === true ? "primary" : "default"}
                        onClick={() => {
                            setStatus(true);
                            onStatusSearch(true);
                        }}
                    >
                        Enabled
                    </Button>
                    <Button
                        type={status === false ? "primary" : "default"}
                        onClick={() => {
                            setStatus(false);
                            onStatusSearch(false);
                        }}
                    >
                        Disabled
                    </Button>
                </Space>
            )}
        </Space>
    );
};