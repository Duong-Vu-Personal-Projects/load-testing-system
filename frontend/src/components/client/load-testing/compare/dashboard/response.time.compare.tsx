import React from "react";
import {Card} from "antd";
import {Column} from "@ant-design/plots";
import Title from "antd/es/typography/Title";
import type {ICompareTestRun} from "../type.compare.tsx";

const ResponseTimeComparisonChart: React.FC<ICompareTestRun> = (props: ICompareTestRun) => {
    const {testRun1, testRun2} = props;
    const data = [
        { category: 'Min', run: testRun1.title, value: testRun1.stats.minResponseTime },
        { category: 'Min', run: testRun2.title, value: testRun2.stats.minResponseTime },
        { category: 'Median', run: testRun1.title, value: testRun1.stats.medianResponseTime },
        { category: 'Median', run: testRun2.title, value: testRun2.stats.medianResponseTime },
        { category: '90th', run: testRun1.title, value: testRun1.stats.sampleTimePercentile90 },
        { category: '90th', run: testRun2.title, value: testRun2.stats.sampleTimePercentile90 },
        { category: '95th', run: testRun1.title, value: testRun1.stats.sampleTimePercentile95 },
        { category: '95th', run: testRun2.title, value: testRun2.stats.sampleTimePercentile95 },
        { category: '99th', run: testRun1.title, value: testRun1.stats.sampleTimePercentile99 },
        { category: '99th', run: testRun2.title, value: testRun2.stats.sampleTimePercentile99 },
        { category: 'Max', run: testRun1.title, value: testRun1.stats.maxResponseTime },
        { category: 'Max', run: testRun2.title, value: testRun2.stats.maxResponseTime },
    ];

    const config = {
        data,
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