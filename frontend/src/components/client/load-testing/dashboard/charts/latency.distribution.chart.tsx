import React, { useMemo } from 'react';
import { Card, Typography } from 'antd';
import { Pie } from '@ant-design/plots';

const { Title } = Typography;

interface ILatencyDistributionProps {
    latencies: number[];
}
const LatencyDistribution: React.FC<ILatencyDistributionProps> = (props: ILatencyDistributionProps) => {
    const {latencies} = props;
    const data = useMemo(() => {
        const buckets = {
            '0-100ms': 0,
            '100-500ms': 0,
            '500-1000ms': 0,
            '1-2s': 0,
            '2-5s': 0,
            '5s+': 0
        };

        latencies.forEach(latency => {
            if (latency < 100) buckets['0-100ms']++;
            else if (latency < 500) buckets['100-500ms']++;
            else if (latency < 1000) buckets['500-1000ms']++;
            else if (latency < 2000) buckets['1-2s']++;
            else if (latency < 5000) buckets['2-5s']++;
            else buckets['5s+']++;
        });

        return Object.entries(buckets)
            .filter(([_, count]) => count > 0)
            .map(([range, count]) => ({
                type: range,
                value: count
            }));
    }, [latencies]);
    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };
    return (
        <Card>
            <Title level={4}>Latency Distribution</Title>
            <Pie {...config} />
        </Card>
    );
};

export default LatencyDistribution;