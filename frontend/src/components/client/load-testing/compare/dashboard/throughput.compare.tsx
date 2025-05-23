import { Card } from "antd";
import React from "react";
import {Column} from "@ant-design/plots";
import Title from "antd/es/typography/Title";
import type {IComparisonDataPoint} from "../type.compare.tsx";
interface IThroughputComparisonProps {
    throughputComparison: IComparisonDataPoint[];
}
const ThroughputComparisonChart:   React.FC<IThroughputComparisonProps> = (props: IThroughputComparisonProps) =>{
    const {throughputComparison} = props;
    const config = {
        data:throughputComparison,
        isGroup: true,
        xField: 'category',
        yField: 'value',
        seriesField: 'run',
        columnWidthRatio: 0.5,
        label: {
            position: 'middle',
        },
    };

    return (
        <Card>
            <Title level={4}>{'Throughput Comparison'}</Title>
            <Column {...config} />
        </Card>
    );

}
export default ThroughputComparisonChart;