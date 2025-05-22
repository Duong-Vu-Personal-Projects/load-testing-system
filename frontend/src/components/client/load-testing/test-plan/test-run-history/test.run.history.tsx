import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Card, Button, App } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {getTestRunOfTestPlanAPI} from "../../../../../services/api.ts";

interface ITestRun {
    id: string;
    title: string;
    time: string;
}

const TestRunHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { notification } = App.useApp();

    const [loading, setLoading] = useState<boolean>(true);
    const [testRuns, setTestRuns] = useState<ITestRun[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const handleCompare = () => {
        if (selectedRowKeys.length !== 2) {
            notification.warning({
                message: 'Select Two Test Runs',
                description: 'Please select exactly two test runs to compare.'
            });
            return;
        }
        navigate(`/plan/compare/${id}/${selectedRowKeys[0]}/${selectedRowKeys[1]}`);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            if (selectedKeys.length > 2) {
                const newKeys = selectedKeys.slice(-2);
                setSelectedRowKeys(newKeys);
                notification.info({
                    message: 'Maximum Selection',
                    description: 'You can only select two test runs for comparison'
                });
            } else {
                setSelectedRowKeys(selectedKeys);
            }
        }
    };
    const columns: ColumnsType<ITestRun> = [
        {
            title: 'Run Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/plan/test-run/${record.id}`)}
                >
                    View Results
                </Button>
            ),
        },
    ];
    const fetchTestRuns = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const page = pagination.current;
            const response = await getTestRunOfTestPlanAPI(id, page, pagination.pageSize);
            if (response.data) {
                setTestRuns(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            }
        } catch (err: any) {
            notification.error({
                message: 'Error',
                description: err?.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (newPagination: any) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize
        });
    };
    useEffect(() => {
        fetchTestRuns();
    }, [id, pagination.current, pagination.pageSize]);

    return (
        <Card
            title="Test Run History"
            extra={
                <Button
                    type="primary"
                    onClick={handleCompare}
                    disabled={selectedRowKeys.length !== 2}
                >
                    Compare Selected Runs
                </Button>
            }
        >
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={testRuns}
                rowKey="id"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} items`
                }}
                loading={loading}
                onChange={handleTableChange}
            />
        </Card>
    );
};

export default TestRunHistory;