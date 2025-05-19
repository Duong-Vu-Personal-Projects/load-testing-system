import React from 'react';
import { Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { chartOptions } from '../../utils/chartDataProcessor';

interface Props {
  data: any;
}

const ResponseTimeChart: React.FC<Props> = ({ data }) => {
  if (!data) return null;
  
  return (
    <Card bordered={false}>
      <div style={{ height: '400px' }}>
        <Line data={data} options={chartOptions.line} />
      </div>
    </Card>
  );
};

export default ResponseTimeChart;