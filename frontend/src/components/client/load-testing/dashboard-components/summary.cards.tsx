import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';

interface Props {
  totalSamples: number;
  avgResponseTime: number;
  errorRate: number;
}

const SummaryCards: React.FC<Props> = ({ 
  totalSamples, 
  avgResponseTime, 
  errorRate 
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic 
            title="Total Samples" 
            value={totalSamples} 
            suffix="requests" 
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic 
            title="Average Response Time" 
            value={avgResponseTime} 
            precision={2}
            suffix="ms" 
            valueStyle={{ color: '#1890ff' }}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card bordered={false}>
          <Statistic 
            title="Error Rate" 
            value={errorRate * 100} 
            precision={2}
            suffix="%" 
            valueStyle={{ color: errorRate > 0 ? '#cf1322' : '#3f8600' }}
            prefix={<WarningOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;