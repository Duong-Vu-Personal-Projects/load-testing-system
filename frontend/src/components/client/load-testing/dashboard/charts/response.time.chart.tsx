import React from "react";
import {Card} from "antd";
import Title from "antd/es/typography/Title";
import { Line } from '@ant-design/plots';

interface IResponseTimeChartProps {
    relativeTimes: number[];
    readableTimes: string[];
    responseTimes: number[];
}

const ResponseTimeChart: React.FC<IResponseTimeChartProps> = (props: IResponseTimeChartProps) => {
    const {relativeTimes, readableTimes, responseTimes} = props;
    const data = relativeTimes.map((time, index) => ({
        time: time.toFixed(2),
        responseTime: responseTimes[index],
        readableTime: readableTimes[index]
    }));
    const config = {
        data,
        xField: 'time',
        yField: 'responseTime',
        axis: {
            y: {
                title: 'Response Time(ms)',
            },
            x: {
                title: "Time"
            }
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        },
    };
    return (
        <Card>
            <Title level={4}>Response Times</Title>
            <Line {...config} />
        </Card>
    );
}

export default ResponseTimeChart;