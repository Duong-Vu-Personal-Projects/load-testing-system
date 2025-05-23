import React from 'react';
import { Breadcrumb } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import EditTestPlan from "../../../components/client/load-testing/test-plan/edit.test.plan.tsx";

const EditTestPlanPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px' }}>
            {/* Breadcrumb navigation */}
            <Breadcrumb
                style={{ marginBottom: 16 }}
                items={
                    [
                        {
                            title: <a onClick={() => navigate('/plan')}>Test Plan</a>
                        },
                        {
                            title: <a onClick={() => navigate(`/plan/${id}`)}>Test Plan Details</a>
                        },
                        {
                            title: 'Edit Test Plan'
                        }
                    ]
                }
            />
            {/* Edit Test Plan Component */}
            <EditTestPlan />
        </div>
    );
};

export default EditTestPlanPage;