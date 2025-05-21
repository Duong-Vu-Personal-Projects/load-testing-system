import { useRef, useState } from 'react';
import { App, Button, Card, Space } from 'antd';
import { EyeTwoTone, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { getAllTestPlanWithPagination } from "../../../services/api.ts";

interface ITableTestPlan {
    id: string;
    title: string;
    time: string;
}

const TablePlan = () => {
    const actionRef = useRef<ActionType>();
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [meta, setMeta] = useState<IMeta>({
        page: 0,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const columns: ProColumns<ITableTestPlan>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            ellipsis: true,
            width: 300,
            render: (text, record) => (
                <a onClick={() => navigate(`/testing/result/${record.id}`)}>
                    {text}
                </a>
            ),
        },
        {
            title: 'Run time',
            dataIndex: 'time',
            valueType: 'dateTime',
            sorter: true,
            width: 160,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    <EyeTwoTone
                        twoToneColor="#1677ff"
                        style={{ cursor: "pointer", fontSize: '16px' }}
                        onClick={() => navigate(`/testing/result/${record.id}`)}
                    />
                </Space>
            ),
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    };

    return (
        <Card>
            <ProTable<ITableTestPlan>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                search={false}
                options={{
                    search: false,
                }}
                request={async (params) => {
                    try {
                        // Build pagination and sorting
                        const page = params.current;
                        const pageSize = params.pageSize || 5;

                        // Make API call
                        const response = await getAllTestPlanWithPagination(page, pageSize);

                        if (response.data) {
                            setMeta({
                                page: response.data.meta.page,
                                pageSize: pageSize,
                                pages: response.data.meta.pages,
                                total: response.data.meta.total
                            });

                            return {
                                data: response.data.result,
                                success: true,
                                total: response.data.meta.total
                            };
                        }
                        return { data: [], success: false, total: 0 };
                    } catch (error) {
                        notification.error({
                            message: "Failed to fetch test plans",
                            description: "There was an error loading the test plans."
                        });
                        return { data: [], success: false, total: 0 };
                    }
                }}
                rowKey="id"
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => (
                        <div>{range[0]}-{range[1]} of {total} test plans</div>
                    )
                }}
                headerTitle="Test Plans"
                toolBarRender={() => [
                    <Button
                        key="create"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/testing/create')}
                    >
                        Create New Test Plan
                    </Button>
                ]}
            />
        </Card>
    );
};

export default TablePlan;