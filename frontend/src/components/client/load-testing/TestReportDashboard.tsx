import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Divider, Badge } from 'antd';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Import components
import SummaryCards from './dashboard-components/summary.cards.tsx';
import TestConfiguration from './dashboard-components/test.configuration.tsx';
import ResponseTimeStatistics from './dashboard-components/response.time.statistics.tsx';
import ChartsTabs from './dashboard-components/charts.tab.tsx';
import RequestDetailsTable from './dashboard-components/request.details.table.tsx';

// Import utility functions
import { 
  processChartData, 
  calculateSuccessRate, 
  calculateAvgResponseTime 
} from './utils/chartDataProcessor';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

interface TestReportProps {
  testData: any;
}

const TestReportDashboard: React.FC<TestReportProps> = ({ testData }) => {
  const data = testData?.data || {};
  const stats = data.stats || {};
  const records = data.records || [];
  
  // Chart data states
  const [chartData, setChartData] = useState<any>({
    responseTimeChart: null,
    throughputChart: null,
    latencyDistributionChart: null,
    connectTimeChart: null
  });
  
  useEffect(() => {
    if (records.length > 0) {
      setChartData(processChartData(records));
    }
  }, [records]);
  
  // Calculate metrics
  const successRate = calculateSuccessRate(records);
  const avgResponseTime = calculateAvgResponseTime(records);

  return (
    <div className="test-report-dashboard">
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <AntTitle level={2}>
              Test Results: {data.title}
              <Badge 
                style={{ marginLeft: 16 }}
                status={successRate === 100 ? "success" : successRate > 90 ? "warning" : "error"} 
                text={successRate === 100 ? "All Requests Successful" : `${successRate.toFixed(2)}% Success Rate`} 
              />
            </AntTitle>
            <Text type="secondary">Test executed at {dayjs(data.time).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </Col>
        </Row>
        
        <Divider orientation="left">Summary</Divider>
        <SummaryCards 
          totalSamples={records.length} 
          avgResponseTime={avgResponseTime} 
          errorRate={stats.errorRate || 0} 
        />
        
        <Divider orientation="left">Test Configuration</Divider>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <TestConfiguration threadGroups={data.threadStageGroups || []} />
          </Col>
        </Row>
        
        <Divider orientation="left">Response Time Statistics</Divider>
        <ResponseTimeStatistics 
          stats={stats} 
          avgResponseTime={avgResponseTime} 
          latencyDistributionChart={chartData.latencyDistributionChart} 
        />
        
        <Divider orientation="left">Charts</Divider>
        <ChartsTabs 
          responseTimeChart={chartData.responseTimeChart}
          throughputChart={chartData.throughputChart}
          connectTimeChart={chartData.connectTimeChart}
        />
        
        <Divider orientation="left">Request Details</Divider>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <RequestDetailsTable records={records} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TestReportDashboard;
