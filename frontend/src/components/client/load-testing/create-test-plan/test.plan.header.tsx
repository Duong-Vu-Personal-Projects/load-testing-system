import React from 'react';
import { Form, Input } from 'antd';

interface ITestPlanHeaderProps {

}

const TestPlanHeader: React.FC<ITestPlanHeaderProps> = () => {
    return (
        <Form.Item
            name="title"
            label="Test Plan Title"
            rules={[{ required: true, message: 'Please provide a title for your test plan' }]}
        >
            <Input placeholder="Enter a unique title for this test plan" />
        </Form.Item>
    );
};

export default TestPlanHeader;