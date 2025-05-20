import React from 'react';
import { Card, Table } from 'antd';

interface Props {
  threadGroups: any[];
}

const TestConfiguration: React.FC<Props> = ({ threadGroups }) => {
  return (
    <Card title="Thread Groups" size="small">
      <Table 
        dataSource={threadGroups}
        rowKey={(record, index) => `thread-group-${index}`}
        pagination={false}
        columns={[
          { title: 'URL', dataIndex: 'url', key: 'url' },
          { title: 'Threads', dataIndex: 'rampToThreads', key: 'threads' },
          { title: 'Ramp-up (sec)', dataIndex: 'rampDuration', key: 'rampDuration' },
          { title: 'Hold Duration (sec)', dataIndex: 'holdDuration', key: 'holdDuration' },
          { title: 'Iterations', dataIndex: 'holdIteration', key: 'holdIteration' }
        ]}
      />
    </Card>
  );
};

export default TestConfiguration;