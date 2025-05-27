import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Divider, Typography, App, Tabs, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ITestPlan, ITestPlanFormValues } from "../create-test-plan/type.test.plan";
import { editTestPlanAPI, getTestPlanDetailAPI } from "../../../../services/api";
import TestPlanHeader from '../create-test-plan/test.plan.header';
import ThreadGroupForm from '../create-test-plan/thread.group.form';
import RpsThreadGroupForm from "../create-test-plan/rps.thread.group.form";

const { Title } = Typography;

const EditTestPlan: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { notification } = App.useApp();
    const [form] = Form.useForm<ITestPlanFormValues>();

    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingData, setFetchingData] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('threadGroups');

    useEffect(() => {
        const fetchTestPlanData = async () => {
            if (!id) return;

            try {
                setFetchingData(true);
                const response = await getTestPlanDetailAPI(id);

                if (response.data) {
                    const testPlan = response.data;
                    form.setFieldsValue({
                        title: testPlan.title,
                        threadStageGroups: testPlan.threadStageGroups || [],
                        rpsThreadStageGroups: testPlan.rpsThreadStageGroups || [],
                    });

                    if (testPlan.threadStageGroups?.length > 0) {
                        const method = testPlan.threadStageGroups[0].httpMethod;
                    }
                } else {
                    notification.error({
                        message: "Failed to get test plan detail",
                        description: response.message || "Unknown error occurred"
                    });
                }
            } catch (err: any) {
                notification.error({
                    message: 'An error occurred while fetching test plan data',
                    description: err?.message || "Unknown error occurred"
                });
            } finally {
                setFetchingData(false);
            }
        };

        fetchTestPlanData();
    }, [id, form]);

    const onFinish = async (values: ITestPlanFormValues) => {
        if (!id) return;

        try {
            setLoading(true);
            // Prepare the request payload
            const testPlan: ITestPlan = {
                id: id,
                title: values.title,
                threadStageGroups: values.threadStageGroups || [],
                rpsThreadStageGroups: values.rpsThreadStageGroups || []
            };

            const response = await editTestPlanAPI(testPlan);

            if (response.data) {
                notification.success({
                    message: 'Update Test Plan Successfully',
                    description: `Test Plan "${values.title}" updated successfully!`
                });
                navigate(`/plan/${id}`);
            } else {
                notification.error({
                    message: 'Failed to update test plan',
                    description: response.message || "Unknown error occurred",
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Failed to update test plan',
                description: error.response?.data?.message || error.message || 'Unknown error occurred'
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 16 }}>Loading test plan data...</p>
                </div>
            </Card>
        );
    }
    const tabItems = [
        {
            key: 'threadGroups',
            label: 'Thread Stage Groups',
            children: <ThreadGroupForm />,
        },
        {
            key: 'rpsGroups',
            label: 'RPS Thread Stage Groups',
            children: <RpsThreadGroupForm />,
        },
    ];
    return (
        <Card title={<Title level={3}>Edit Test Plan</Title>}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={true}
            >
                {/* Test Plan Title */}
                <TestPlanHeader />

                <Divider orientation="left">Load Configuration</Divider>

                {/* Thread Groups Tabs */}
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

                <Form.Item style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SaveOutlined />}
                    >
                        Update Test Plan
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EditTestPlan;