import React from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
    type IAutoStopConfig,
    AutoStopMetricTypes,
    AutoStopAggregations,
    AutoStopComparisons
} from '../type.test.plan';

// Preset configurations
const presets = {
    // Stop if any error occurs
    stopOnAnyError: (): IAutoStopConfig => ({
        enabled: true,
        name: 'Stop on Any Error',
        conditions: [
            {
                metricType: AutoStopMetricTypes.ERRORS,
                aggregation: AutoStopAggregations.TOTAL,
                comparison: AutoStopComparisons.GREATER_THAN,
                thresholdValue: 0
            }
        ]
    }),

    // Stop if response time exceeds 1 second
    stopOnSlowResponse: (): IAutoStopConfig => ({
        enabled: true,
        name: 'Stop on Slow Response',
        conditions: [
            {
                metricType: AutoStopMetricTypes.SAMPLE_TIME,
                aggregation: AutoStopAggregations.MAX,
                comparison: AutoStopComparisons.GREATER_THAN_OR_EQUAL,
                thresholdValue: 1000,
                holdForDuration: 5
            }
        ]
    }),

    // Stop if error rate exceeds 5%
    stopOnHighErrorRate: (): IAutoStopConfig => ({
        enabled: true,
        name: 'Stop on High Error Rate',
        conditions: [
            {
                metricType: AutoStopMetricTypes.ERRORS,
                aggregation: AutoStopAggregations.PERCENT,
                comparison: AutoStopComparisons.GREATER_THAN_OR_EQUAL,
                thresholdValue: 5,
                holdForDuration: 5,
                aggregationResetPeriod: 5
            }
        ]
    }),

    // Stop if throughput falls below threshold
    stopOnLowThroughput: (): IAutoStopConfig => ({
        enabled: true,
        name: 'Stop on Low Throughput',
        conditions: [
            {
                metricType: AutoStopMetricTypes.SAMPLES,
                aggregation: AutoStopAggregations.PER_SECOND,
                comparison: AutoStopComparisons.LESS_THAN,
                thresholdValue: 1,
                holdForDuration: 10,
                aggregationResetPeriod: 5
            }
        ]
    }),

    // Comprehensive auto-stop with multiple conditions
    comprehensive: (): IAutoStopConfig => ({
        enabled: true,
        name: 'Comprehensive Auto-Stop',
        conditions: [
            {
                metricType: AutoStopMetricTypes.SAMPLE_TIME,
                aggregation: AutoStopAggregations.MAX,
                comparison: AutoStopComparisons.GREATER_THAN_OR_EQUAL,
                thresholdValue: 5000
            },
            {
                metricType: AutoStopMetricTypes.ERRORS,
                aggregation: AutoStopAggregations.PERCENT,
                comparison: AutoStopComparisons.GREATER_THAN_OR_EQUAL,
                thresholdValue: 5,
                holdForDuration: 5,
                aggregationResetPeriod: 5
            },
            {
                metricType: AutoStopMetricTypes.SAMPLES,
                aggregation: AutoStopAggregations.PER_SECOND,
                comparison: AutoStopComparisons.LESS_THAN,
                thresholdValue: 1,
                holdForDuration: 10,
                aggregationResetPeriod: 5
            }
        ]
    })
};

interface AutoStopPresetsProps {
    onApplyPreset: (preset: IAutoStopConfig) => void;
}

const AutoStopPresets: React.FC<AutoStopPresetsProps> = ({ onApplyPreset }) => {
    const items = [
        {
            key: 'stopOnAnyError',
            label: 'Stop on Any Error',
            onClick: () => onApplyPreset(presets.stopOnAnyError())
        },
        {
            key: 'stopOnSlowResponse',
            label: 'Stop on Slow Response (>1s)',
            onClick: () => onApplyPreset(presets.stopOnSlowResponse())
        },
        {
            key: 'stopOnHighErrorRate',
            label: 'Stop on High Error Rate (>5%)',
            onClick: () => onApplyPreset(presets.stopOnHighErrorRate())
        },
        {
            key: 'stopOnLowThroughput',
            label: 'Stop on Low Throughput (<1 req/s)',
            onClick: () => onApplyPreset(presets.stopOnLowThroughput())
        },
        {
            key: 'comprehensive',
            label: 'Comprehensive Auto-Stop',
            onClick: () => onApplyPreset(presets.comprehensive())
        }
    ];

    return (
        <Dropdown menu={{ items }}>
            <Button>
                Apply Preset <DownOutlined />
            </Button>
        </Dropdown>
    );
};

export default AutoStopPresets;
export { presets };