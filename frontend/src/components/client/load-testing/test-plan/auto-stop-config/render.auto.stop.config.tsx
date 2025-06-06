import {Tag, Typography } from "antd";
import type { IAutoStopConfig } from "../../create-test-plan/type.test.plan";

const { Text } = Typography;

// Add a function to render auto-stop configurations
const RenderAutoStopConfig = (autoStop?: IAutoStopConfig) => {
    if (!autoStop || !autoStop.enabled) {
        return <Text type="secondary">No auto-stop configuration</Text>;
    }

    return (
        <div>
            <div>
                <Tag color="green">Enabled</Tag>
                {autoStop.name && <Tag color="blue">{autoStop.name}</Tag>}
            </div>

            <div style={{ marginTop: 8 }}>
                {autoStop.samplePattern && (
                    <Text type="secondary">Sample Pattern: {autoStop.samplePattern}</Text>
                )}
            </div>

            <div style={{ marginTop: 8 }}>
                <Text strong>Conditions:</Text>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {autoStop.conditions.map((condition, index) => {
                        // Format the condition in a readable way
                        let description = '';

                        // Metric part
                        switch (condition.metricType) {
                            case 'latencyTime':
                                description += 'Latency Time';
                                break;
                            case 'sampleTime':
                                description += 'Response Time';
                                break;
                            case 'connectionTime':
                                description += 'Connection Time';
                                break;
                            case 'samples':
                                description += 'Samples';
                                break;
                            case 'errors':
                                description += 'Errors';
                                break;
                            case 'sentBytes':
                                description += 'Sent Bytes';
                                break;
                            case 'receivedBytes':
                                description += 'Received Bytes';
                                break;
                        }

                        // Aggregation part
                        switch (condition.aggregation) {
                            case 'min':
                                description += ' (Minimum)';
                                break;
                            case 'max':
                                description += ' (Maximum)';
                                break;
                            case 'mean':
                                description += ' (Mean)';
                                break;
                            case 'percentile':
                                description += ` (${condition.percentile}th Percentile)`;
                                break;
                            case 'total':
                                description += ' (Total)';
                                break;
                            case 'perSecond':
                                description += ' (Per Second)';
                                break;
                            case 'percent':
                                description += ' (Percent)';
                                break;
                        }

                        // Comparison part
                        switch (condition.comparison) {
                            case 'lessThan':
                                description += ' < ';
                                break;
                            case 'lessThanOrEqual':
                                description += ' ≤ ';
                                break;
                            case 'greaterThan':
                                description += ' > ';
                                break;
                            case 'greaterThanOrEqual':
                                description += ' ≥ ';
                                break;
                        }

                        // Threshold part
                        description += condition.thresholdValue;

                        // Units
                        if (condition.metricType === 'latencyTime' ||
                            condition.metricType === 'sampleTime' ||
                            condition.metricType === 'connectionTime') {
                            description += 'ms';
                        } else if (condition.metricType === 'errors' && condition.aggregation === 'percent') {
                            description += '%';
                        } else if (condition.metricType === 'samples' && condition.aggregation === 'perSecond') {
                            description += ' req/s';
                        }

                        // Additional params
                        let additionalParams = [];
                        if (condition.holdForDuration) {
                            additionalParams.push(`hold for ${condition.holdForDuration}s`);
                        }
                        if (condition.aggregationResetPeriod) {
                            additionalParams.push(`reset every ${condition.aggregationResetPeriod}s`);
                        }

                        if (additionalParams.length > 0) {
                            description += ` (${additionalParams.join(', ')})`;
                        }

                        return <li key={index}>{description}</li>;
                    })}
                </ul>
            </div>
        </div>
    );
};
export  default RenderAutoStopConfig;