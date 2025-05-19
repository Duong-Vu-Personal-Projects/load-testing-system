import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const TablePlan = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    // Load test plan data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/v1/load-test');
                if (response && response.data) {
                    setData(response.data.content || []);
                }
            } catch (error) {
                console.error('Failed to fetch test plans:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            ellipsis: true,
        },
        {
            title: 'Threads',
            dataIndex: 'threads',
            key: 'threads',
        },
        {
            title: 'Iterations',
            dataIndex: 'iterations',
            key: 'iterations',
        },
        {
            title: 'Created At',
            dataIndex: 'time',
            key: 'time',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => navigate(`/testing/results/${record.id}`)}>
                        View Results
                    </Button>
                    <Button onClick={() => navigate(`/testing/run/${record.id}`)}>
                        Run Again
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3}>Test Plans</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate('/testing/create')}
                >
                    Create New Test Plan
                </Button>
            </div>
            <Table 
                columns={columns} 
                dataSource={data} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
};

export default TablePlan;