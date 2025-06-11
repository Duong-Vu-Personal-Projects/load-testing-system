import {Card} from "antd";
import {Pie} from "@ant-design/plots";
import React from "react";

import Title from "antd/es/typography/Title";
import type {IErrorRateComparison, ITestRunBasicInfo} from "../type.compare.tsx";
interface IErrorRateComparisonProps {
    errorRateComparison: IErrorRateComparison,
    testRun1: ITestRunBasicInfo;
    testRun2: ITestRunBasicInfo;
}
const ErrorRateComparisonChart: React.FC<IErrorRateComparisonProps> = (props: IErrorRateComparisonProps) => {
    const {errorRateComparison, testRun1, testRun2} = props;
    const config1 = {
        data: errorRateComparison.run1Data,
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
        data: errorRateComparison.run2Data,
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
                    Error Rate: {(errorRateComparison.run1ErrorRate * 100).toFixed(2)} %
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Title level={5}>{testRun2.title}</Title>
                    <Pie
                        {...config2}
                    />
                    Error Rate: {(errorRateComparison.run2ErrorRate * 100).toFixed(2)}%
                </div>
            </div>
        </Card>
    );
}
export default  ErrorRateComparisonChart;