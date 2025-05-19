import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import LatencyDistributionChart from './charts/LatencyDistributionChart';

const { Text } = Typography;

interface Props {
  stats: any;
  avgResponseTime: number;
  latencyDistributionChart: any;
}

const ResponseTimeStatistics: React.FC<Props> = ({ 
  stats, 
  avgResponseTime,
  latencyDistributionChart
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={8}>
        <Card title="Response Time Percentiles" bordered={false}>
          <Text strong>Minimum: </Text><Text>{stats.minResponseTime} ms</Text><br/>
          <Text strong>Maximum: </Text><Text>{stats.maxResponseTime} ms</Text><br/>
          <Text strong>Average: </Text><Text>{avgResponseTime.toFixed(2)} ms</Text><br/>
          <Text strong>Median (50%): </Text><Text>{stats.medianResponseTime} ms</Text><br/>
          <Text strong>90% Line: </Text><Text>{stats.sampleTimePercentile90} ms</Text><br/>
          <Text strong>95% Line: </Text><Text>{stats.sampleTimePercentile95} ms</Text><br/>
          <Text strong>99% Line: </Text><Text>{stats.sampleTimePercentile99} ms</Text><br/>
        </Card>
      </Col>
      <Col xs={24} lg={16}>
        <LatencyDistributionChart data={latencyDistributionChart} />
      </Col>
    </Row>
  );
};

export default ResponseTimeStatistics;