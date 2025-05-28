import React, { useState } from 'react';
import { Input, Button, Space, DatePicker } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface ISearchBarProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    allowClear?: boolean;
}

interface IAdvancedSearchBarProps extends ISearchBarProps {
    onDateRangeSearch?: (start: string, end: string) => void;
    onErrorRateSearch?: (rate: number) => void;
    onStatusSearch?: (enabled: boolean) => void;
    showDateFilter?: boolean;
    showErrorRateFilter?: boolean;
    showStatusFilter?: boolean;
}


export const SearchBar: React.FC<ISearchBarProps> = (props: ISearchBarProps) => {
    const {onSearch, placeholder = "Search...", allowClear = true} = props;
    const [searchText, setSearchText] = useState<string>('');

    const handleSearch = () => {
        onSearch(searchText);
    };

    const handleClear = () => {
        setSearchText('');
        onSearch('');
    };

    return (
        <Space>
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
                Search
            </Button>
            {allowClear && (
                <Button onClick={handleClear}>
                    <ClearOutlined /> Clear
                </Button>
            )}
        </Space>
    );
};

export const AdvancedSearchBar: React.FC<IAdvancedSearchBarProps> = (props: IAdvancedSearchBarProps) => {
    const {onSearch,
        onDateRangeSearch,
        onErrorRateSearch,
        onStatusSearch,
        placeholder = "Search...",
        allowClear = true,
        showDateFilter = false,
        showErrorRateFilter = false,
        showStatusFilter = false} = props;
    const [searchText, setSearchText] = useState<string>('');
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [errorRate, setErrorRate] = useState<number | null>(null);
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
        }
    };

    const handleErrorRateSearch = () => {
        if (errorRate !== null && onErrorRateSearch) {
            onErrorRateSearch(errorRate);
        }
    };

    // Removed the unused handleStatusSearch function

    const handleClear = () => {
        setSearchText('');
        setDateRange(null);
        setErrorRate(null);
        setStatus(null);
        onSearch('');
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
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
                    Search
                </Button>
                {allowClear && (
                    <Button onClick={handleClear}>
                        <ClearOutlined /> Clear All Filters
                    </Button>
                )}
            </Space>

            {showDateFilter && onDateRangeSearch && (
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
                        showTime
                    />
                    <Button onClick={handleDateRangeSearch} disabled={!dateRange || !dateRange[0] || !dateRange[1]}>
                        Filter by Date
                    </Button>
                </Space>
            )}

            {showErrorRateFilter && onErrorRateSearch && (
                <Space>
                    <Input
                        placeholder="Minimum error rate (e.g. 0.05)"
                        value={errorRate !== null ? errorRate : ''}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setErrorRate(isNaN(value) ? null : value);
                        }}
                        style={{ width: 200 }}
                        type="number"
                        min={0}
                        max={1}
                        step={0.01}
                    />
                    <Button onClick={handleErrorRateSearch} disabled={errorRate === null}>
                        Filter by Error Rate
                    </Button>
                </Space>
            )}

            {showStatusFilter && onStatusSearch && (
                <Space>
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