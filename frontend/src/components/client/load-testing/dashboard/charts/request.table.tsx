import React, { useState } from 'react';
import { Table, Card, Typography, Tag, Input, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ITestResultDTO } from "../../create-test-plan/type.test.plan.tsx";

const { Title } = Typography;

interface IRequestsTableProps {
    resultDTO: ITestResultDTO;
}

// Define a record type for type safety
interface Record {
    key: number;
    timeStamp: number;
    elapsed: number;
    label: string;
    responseCode: number;
    responseMessage: string;
    threadName: string;
    success: boolean;
    failureMessage: string;
    bytes: number;
    sentBytes: number;
    url: string;
    latency: number;
    connect: number;
    relativeTime: number;
    readableTime: string;
}

const RequestsTable: React.FC<IRequestsTableProps> = (props: IRequestsTableProps) => {
    const [searchText, setSearchText] = useState<string>('');
    const { resultDTO } = props;
    
    // Create records from arrays
    const records: Record[] = resultDTO.timeStamps.map((timestamp, index) => ({
        key: index,
        timeStamp: timestamp,
        elapsed: resultDTO.elapsedTimes[index],
        label: resultDTO.labels[index],
        responseCode: resultDTO.responseCodes[index],
        responseMessage: resultDTO.responseMessages[index],
        threadName: resultDTO.threadNames[index],
        success: resultDTO.successes[index],
        failureMessage: resultDTO.failureMessages[index],
        bytes: resultDTO.bytes[index],
        sentBytes: resultDTO.sentBytes[index],
        url: resultDTO.urls[index],
        latency: resultDTO.latencies[index],
        connect: resultDTO.connectTimes[index],
        relativeTime: resultDTO.relativeTimes[index],
        readableTime: resultDTO.readableTimes[index]
    }));

    // Define columns for the table
    const columns: ColumnsType<Record> = [
        {
            title: 'Status',
            dataIndex: 'success',
            key: 'success',
            width: 80,
            render: success => (
                <Tag color={success ? 'success' : 'error'}>
                    {success ? 'Success' : 'Error'}
                </Tag>
            ),
            filters: [
                { text: 'Success', value: true },
                { text: 'Error', value: false },
            ],
            onFilter: (value, record) => record.success === value,
        },
        {
            title: 'Time',
            dataIndex: 'readableTime',
            key: 'readableTime',
            width: 120,
            sorter: (a, b) => a.timeStamp - b.timeStamp,
        },
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            width: 150,
            // Remove the 'filterable' property and use filters + onFilter instead
            filters: Array.from(new Set(records.map(r => r.label))).map(label => ({
                text: label,
                value: label,
            })),
            onFilter: (value, record) => record.label === value,
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
            width: 250,
            // Remove the 'filterable' property
            render: url => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
            ),
        },
        {
            title: 'Response (ms)',
            dataIndex: 'elapsed',
            key: 'elapsed',
            width: 120,
            sorter: (a, b) => a.elapsed - b.elapsed,
        },
        {
            title: 'Latency (ms)',
            dataIndex: 'latency',
            key: 'latency',
            width: 120,
            sorter: (a, b) => a.latency - b.latency,
        },
        {
            title: 'Connect (ms)',
            dataIndex: 'connect',
            key: 'connect',
            width: 120,
            sorter: (a, b) => a.connect - b.connect,
        },
        {
            title: 'Thread',
            dataIndex: 'threadName',
            key: 'threadName',
            width: 150,
        },
        {
            title: 'Response Code',
            dataIndex: 'responseCode',
            key: 'responseCode',
            width: 120,
            render: code => (
                <Tag color={code >= 200 && code < 300 ? 'green' : code >= 300 && code < 400 ? 'blue' : 'red'}>
                    {code}
                </Tag>
            ),
        },
        {
            title: 'Bytes',
            dataIndex: 'bytes',
            key: 'bytes',
            width: 100,
            render: bytes => `${(bytes / 1024).toFixed(2)} KB`,
        },
    ];

    // Filter the records based on search text
    const filteredRecords = searchText
        ? records.filter(record =>
            record.url.toLowerCase().includes(searchText.toLowerCase()) ||
            record.label.toLowerCase().includes(searchText.toLowerCase()) ||
            record.threadName.toLowerCase().includes(searchText.toLowerCase())
        )
        : records;

    return (
        <Card>
            <Title level={4}>Request Details</Title>

            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search URL, label or thread"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    allowClear
                />
                <Button
                    icon={<ReloadOutlined />}
                    onClick={() => setSearchText('')}
                >
                    Reset Filters
                </Button>
                <span>
                    {filteredRecords.length} of {records.length} requests
                </span>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredRecords}
                rowKey="key"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} requests`,
                }}
                scroll={{ x: 1300 }}
                size="middle"
            />
        </Card>
    );
};

export default RequestsTable;