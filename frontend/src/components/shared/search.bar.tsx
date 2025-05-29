import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

export interface ISearchBarProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    allowClear?: boolean;
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

