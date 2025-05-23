import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface INoSchedulesProps {
    onCreateClick: () => void;
}

const NoSchedules: React.FC<INoSchedulesProps> = ({ onCreateClick }) => {
    return (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No schedules found"
        >
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
                Create Schedule
            </Button>
        </Empty>
    );
};

export default NoSchedules;