import { Card } from "antd";
import React from "react";
import {Column} from "@ant-design/plots";
import Title from "antd/es/typography/Title";
import type {ICompareTestRun} from "../type.compare.tsx";

const ThroughputComparisonChart:   React.FC<ICompareTestRun> = (props: ICompareTestRun) =>{
    const {testRun1, testRun2} = props;
    const rps1 = testRun1.stats.sampleCounts / (testRun1.stats.duration / 1000);
    const rps2 = testRun2.stats.sampleCounts / (testRun2.stats.duration / 1000);

    const data = [
        { category: 'Total Requests', run: testRun1.title, value: testRun1.stats.sampleCounts },
        { category: 'Total Requests', run: testRun2.title, value: testRun2.stats.sampleCounts },
        { category: 'Requests/sec', run: testRun1.title, value: rps1 },
        { category: 'Requests/sec', run: testRun2.title, value: rps2 },
    ];

    const config = {
        data,
        isGroup: true,
        xField: 'category',
        yField: 'value',
        seriesField: 'run',
        columnWidthRatio: 0.5,
        label: {
            position: 'middle',
            layout: [
                { type: 'interval-adjust-position' },
                { type: 'interval-hide-overlap' },
                { type: 'adjust-color' },
            ],
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