import React from 'react';
import { Card, Typography } from 'antd';
import { Column } from '@ant-design/plots';

const { Title } = Typography;

interface IThroughputChartProps {
    throughputData: Array<number[]>; // [time, requestCount] pairs
}

/**
 * Displays a column chart of throughput (requests per second)
 */
const ThroughputChart: React.FC<IThroughputChartProps> = (props: IThroughputChartProps) => {
    const {throughputData} = props;
    const data = throughputData.map(([time, count]) => ({
        time: time.toFixed(0),
        throughput: count
    }));

    // Chart configuration
    const config = {
        data,
        xField: 'time',
        yField: 'throughput',
        axis: {
            x: {
                title: 'Time (seconds)'
            },
            y: {
                title: 'Requests per Second'
            },

        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
    };

    return (
        <Card>
            <Title level={4}>Throughput (Requests/Second)</Title>
            <Column {...config} />
        </Card>
    );
};

export default ThroughputChart;