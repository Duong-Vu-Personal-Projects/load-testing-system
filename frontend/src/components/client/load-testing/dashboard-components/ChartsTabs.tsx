import React from 'react';
import { Row, Col, Tabs } from 'antd';
import ResponseTimeChart from './charts/ResponseTimeChart';
import ThroughputChart from './charts/ThroughputChart';
import ConnectTimeChart from './charts/ConnectTimeChart';

const { TabPane } = Tabs;

interface Props {
  responseTimeChart: any;
  throughputChart: any;
  connectTimeChart: any;
}

const ChartsTabs: React.FC<Props> = ({ 
  responseTimeChart, 
  throughputChart, 
  connectTimeChart 
}) => {
  return (
    <Tabs defaultActiveKey="responseTime">
      <TabPane tab="Response Times" key="responseTime">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ResponseTimeChart data={responseTimeChart} />
          </Col>
        </Row>
      </TabPane>
      
      <TabPane tab="Throughput" key="throughput">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ThroughputChart data={throughputChart} />
          </Col>
        </Row>
      </TabPane>
      
      <TabPane tab="Connection Time" key="connectTime">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ConnectTimeChart data={connectTimeChart} />
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  );
};

export default ChartsTabs;