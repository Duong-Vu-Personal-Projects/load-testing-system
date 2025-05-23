import React from "react";
import {Card} from "antd";
import {Column} from "@ant-design/plots";
import Title from "antd/es/typography/Title";
import type {IComparisonDataPoint} from "../type.compare.tsx";
interface IResponseTimeComparisonProps{
    responseTimeComparison: IComparisonDataPoint[];
}
const ResponseTimeComparisonChart: React.FC<IResponseTimeComparisonProps> = (props: IResponseTimeComparisonProps) => {
    const {responseTimeComparison} = props;
    console.log(responseTimeComparison);
    const config = {
        data: responseTimeComparison,
        xField: 'category',
        yField: 'value',
        seriesField: 'run',
        label: {
            position: 'middle',
        },
        axis: {
            y: {
                title: "Response Time (ms)"
            }
        }
    };

    return (
        <Card>
            <Title level={4}>{'Response Time Comparison'}</Title>
            <Column {...config} />
        </Card>
    );
}
export default ResponseTimeComparisonChart;