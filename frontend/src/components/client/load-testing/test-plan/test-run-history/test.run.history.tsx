import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Table, Card, Button, App, Breadcrumb} from 'antd';
import {DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
    deleteTestRunAPI,
    getTestRunOfTestPlanAPI,
    getTestRunsOfTestPlanWithSearchAPI
} from "../../../../../services/api.ts";
import {TimeSearchBar} from "../../../../shared/time.search.bar.tsx";

interface ITestRun {
    id: string;
    title: string;
    time: string;
}

interface IPagination {
    current: number,
    pageSize: number,
    total: number
}

interface ISearchParams {
    title: string;
    startDate: string;
    endDate: string;
}

const TestRunHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { notification, modal } = App.useApp();

    const [loading, setLoading] = useState<boolean>(true);
    const [testRuns, setTestRuns] = useState<ITestRun[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState<IPagination>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchParams, setSearchParams] = useState<ISearchParams>({
        title: '',
        startDate: '',
        endDate: ''
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
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/plan/test-run/${record.id}`)}
                    >
                        View Results
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteTestRun(record)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const fetchTestRuns = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const page = pagination.current;

            const hasSearchCriteria = searchParams.title.trim() ||
                searchParams.startDate ||
                searchParams.endDate;

            let response;
            if (hasSearchCriteria) {
                response = await getTestRunsOfTestPlanWithSearchAPI(
                    id,
                    page,
                    pagination.pageSize,
                    searchParams.title.trim() || undefined,
                    searchParams.startDate || undefined,
                    searchParams.endDate || undefined
                );
            } else {
                response = await getTestRunOfTestPlanAPI(id, page, pagination.pageSize);
            }

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
            current: newPagination.current || 1,
            pageSize: newPagination.pageSize || 10
        });
    };

    // Handle title search - update title but keep date range
    const handleSearch = (value: string): void => {
        setSearchParams({
            ...searchParams,
            title: value
        });
        setPagination({
            ...pagination,
            current: 1
        });
    };

    const handleDateRangeSearch = (start: string, end: string): void => {
        const formattedStart = start ? dayjs(start).format('YYYY-MM-DDTHH:mm:ss') : '';
        const formattedEnd = end ? dayjs(end).format('YYYY-MM-DDTHH:mm:ss') : '';

        setSearchParams({
            ...searchParams,
            startDate: formattedStart,
            endDate: formattedEnd
        });
        setPagination({
            ...pagination,
            current: 1
        });
    };
    const hasActiveSearch = () => {
        return searchParams.title.trim() ||
            searchParams.startDate ||
            searchParams.endDate;
    };

    useEffect(() => {
        fetchTestRuns();
    }, [id, pagination.current, pagination.pageSize, searchParams]);

    const handleDeleteTestRun = (record: ITestRun) => {
        modal.confirm({
            title: `Are you sure you want to delete test run "${record.title}"?`,
            content: 'This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteTestRunAPI(record.id);
                    notification.success({
                        message: 'Test Run Deleted',
                        description: 'The test run has been successfully deleted.'
                    });
                    fetchTestRuns();
                } catch (error: any) {
                    notification.error({
                        message: 'Failed to Delete Test Run',
                        description: error.response?.data?.message || error.message || 'An unknown error occurred.'
                    });
                }
            }
        });
    };

    return (
        <>
            <Breadcrumb
                style={{ marginBottom: 16 }}
                items={[
                    {
                        title: <a onClick={() => navigate('/plan')}>Test Plan</a>
                    },
                    {
                        title: <a onClick={() => navigate(`/plan/${id}`)}>Test Plan Details</a>
                    },
                    {
                        title: 'Test Run History'
                    }
                ]}
            />
            <Card
                title="Test Run History"
                extra={
                    <>
                        <Button
                            type="primary"
                            onClick={handleCompare}
                            disabled={selectedRowKeys.length !== 2}
                        >
                            Compare Selected Runs
                        </Button>
                    </>
                }
            >
                <div style={{ marginBottom: 16 }}>
                    <TimeSearchBar
                        onSearch={handleSearch}
                        onDateRangeSearch={handleDateRangeSearch}
                        placeholder="Search test runs by title..."
                        showDateFilter={true}
                    />

                    {/* Show active search criteria */}
                    {hasActiveSearch() && (
                        <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                            <strong>Active Filters:</strong>
                            {searchParams.title && (
                                <span style={{ marginLeft: 8, padding: '2px 8px', backgroundColor: '#e6f7ff', borderRadius: 4 }}>
                                    Title: "{searchParams.title}"
                                </span>
                            )}
                            {(searchParams.startDate || searchParams.endDate) && (
                                <span style={{ marginLeft: 8, padding: '2px 8px', backgroundColor: '#f6ffed', borderRadius: 4 }}>
                                    Date: {searchParams.startDate ? dayjs(searchParams.startDate).format('YYYY-MM-DD HH:mm') : 'Any'}
                                    {' to '}
                                    {searchParams.endDate ? dayjs(searchParams.endDate).format('YYYY-MM-DD HH:mm') : 'Any'}
                                </span>
                            )}
                        </div>
                    )}
                </div>

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
        </>
    );
};

export default TestRunHistory;