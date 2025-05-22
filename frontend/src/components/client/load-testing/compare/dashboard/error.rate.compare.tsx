import {Card} from "antd";
import {Pie} from "@ant-design/plots";
import React from "react";

import Title from "antd/es/typography/Title";
import type {ICompareTestRun} from "../type.compare.tsx";

const ErrorRateComparisonChart: React.FC<ICompareTestRun> = (props: ICompareTestRun) => {
    const {testRun1, testRun2} = props;
    const config1 = {
        data: [
                { type: 'Success', value: testRun1.stats.sampleCounts - testRun1.stats.errorCount },
                { type: 'Error', value: testRun1.stats.errorCount }
        ],
        angleField:'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            text: 'value',
            position: 'outside',
        },
        legend: {
            color: {
                position: 'bottom',
            },
        },

    };
    const config2 = {
        data: [
            { type: 'Success', value: testRun2.stats.sampleCounts - testRun2.stats.errorCount },
            { type: 'Error', value: testRun2.stats.errorCount }
        ],
        angleField:'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            text: 'value',
            position: 'outside',
        },
        legend: {
            color: {
                position: 'bottom',
            },
        },

    };
    return (
        <Card>
            <Title level={4}>{'Error Rate Comparison'}</Title>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Title level={5}>{testRun1.title}</Title>

                    <Pie
                        {...config1}
                    />
                    Error Rate: {(testRun1.stats.errorRate * 100).toFixed(2)}%
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Title level={5}>{testRun2.title}</Title>
                    <Pie
                        {...config2}
                    />
                    Error Rate: {(testRun2.stats.errorRate * 100).toFixed(2)}%
                </div>
            </div>
        </Card>
    );
}
export default  ErrorRateComparisonChart;