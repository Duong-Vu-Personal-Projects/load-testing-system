import React from 'react';
import { Card } from 'antd';
import { Bar } from 'react-chartjs-2';
import { chartOptions } from '../../utils/chartDataProcessor';

interface Props {
  data: any;
}

const ThroughputChart: React.FC<Props> = ({ data }) => {
  if (!data) return null;
  
  return (
    <Card bordered={false}>
      <div style={{ height: '400px' }}>
        <Bar data={data} options={chartOptions.bar} />
      </div>
    </Card>
  );
};

export default ThroughputChart;