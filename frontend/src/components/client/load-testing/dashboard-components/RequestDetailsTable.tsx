import React from 'react';
import { Badge, Table } from 'antd';

interface Props {
  records: any[];
}

const RequestDetailsTable: React.FC<Props> = ({ records }) => {
  return (
    <Table
      dataSource={records}
      rowKey={(record, index) => `record-${index}`}
      scroll={{ x: true }}
      pagination={{ pageSize: 10 }}
      columns={[
        { 
          title: 'Status', 
          key: 'status',
          render: (_: any, record: any) => (
            <Badge 
              status={record.success ? "success" : "error"} 
              text={record.success ? "Success" : "Failed"} 
            />
          ),
          width: 100,
          fixed: 'left'
        },
        { 
          title: 'Label', 
          dataIndex: 'label', 
          key: 'label', 
          width: 150 
        },
        { 
          title: 'URL', 
          dataIndex: 'url', 
          key: 'url', 
          ellipsis: true 
        },
        { 
          title: 'Response Time', 
          dataIndex: 'elapsed', 
          key: 'elapsed',
          render: (elapsed: number) => `${elapsed} ms`,
          sorter: (a: any, b: any) => a.elapsed - b.elapsed,
          width: 150 
        },
        { 
          title: 'Latency', 
          dataIndex: 'latency', 
          key: 'latency',
          render: (latency: number) => `${latency} ms`,
          width: 120 
        },
        { 
          title: 'Connect', 
          dataIndex: 'connect', 
          key: 'connect',
          render: (connect: number) => `${connect} ms`,
          width: 120 
        },
        { 
          title: 'Bytes', 
          key: 'bytes',
          render: (_: any, record: any) => `${record.bytes} / ${record.sentBytes}`,
          width: 120 
        },
        { 
          title: 'Thread', 
          dataIndex: 'threadName', 
          key: 'threadName',
          width: 150 
        },
      ]}
    />
  );
};

export default RequestDetailsTable;