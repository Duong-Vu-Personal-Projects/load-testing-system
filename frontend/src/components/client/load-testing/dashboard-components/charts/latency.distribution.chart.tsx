import React from 'react';
import { Card } from 'antd';
import { Pie } from 'react-chartjs-2';
import { chartOptions } from '../../utils/chartDataProcessor';

interface Props {
  data: any;
  title?: string;
}

const LatencyDistributionChart: React.FC<Props> = ({ data, title = "Response Time Distribution" }) => {
  if (!data) return null;
  
  return (
    <Card title={title} bordered={false}>
      <div style={{ height: '300px' }}>
        <Pie data={data} options={chartOptions.pie} />
      </div>
    </Card>
  );
};

export default LatencyDistributionChart;