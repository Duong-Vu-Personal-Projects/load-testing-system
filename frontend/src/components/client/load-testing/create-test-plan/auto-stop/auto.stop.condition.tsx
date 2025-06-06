import React, { useEffect } from 'react';
import { Form, Select, InputNumber, Space, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  AutoStopMetricTypes,
  AutoStopAggregations,
  AutoStopComparisons
} from '../type.test.plan';

interface IAutoStopConditionProps {
  index: number;
  remove: (index: number) => void;
  namePrefix: string[];
}

const AutoStopCondition: React.FC<IAutoStopConditionProps> = ({
  index,
  remove,
  namePrefix
}) => {
  const form = Form.useFormInstance();

  // Watch metricType and aggregation separately
  const metricType = Form.useWatch([...namePrefix, 'metricType'], form);
  const aggregation = Form.useWatch([...namePrefix, 'aggregation'], form);

  // Set default aggregation when metricType changes
  useEffect(() => {
    if (!metricType) return;
    let defaultAgg: string;
    switch (metricType) {
      case AutoStopMetricTypes.LATENCY_TIME:
      case AutoStopMetricTypes.SAMPLE_TIME:
      case AutoStopMetricTypes.CONNECTION_TIME:
        defaultAgg = AutoStopAggregations.MAX;
        break;
      case AutoStopMetricTypes.SAMPLES:
      case AutoStopMetricTypes.SENT_BYTES:
      case AutoStopMetricTypes.RECEIVED_BYTES:
        defaultAgg = AutoStopAggregations.TOTAL;
        break;
      case AutoStopMetricTypes.ERRORS:
        defaultAgg = AutoStopAggregations.PERCENT;
        break;
      default:
        defaultAgg = AutoStopAggregations.MAX;
    }
    if (!aggregation) {
      form.setFieldValue([...namePrefix, 'aggregation'], defaultAgg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricType]);

  // Clear percentile if aggregation is not percentile
  useEffect(() => {
    if (aggregation !== AutoStopAggregations.PERCENTILE) {
      form.setFieldValue([...namePrefix, 'percentile'], undefined);
    } else if (aggregation === AutoStopAggregations.PERCENTILE && !form.getFieldValue([...namePrefix, 'percentile'])) {
      form.setFieldValue([...namePrefix, 'percentile'], 90);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggregation]);

  const getAggregationOptions = () => {
    if (!metricType) return [];
    if (
      metricType === AutoStopMetricTypes.LATENCY_TIME ||
      metricType === AutoStopMetricTypes.SAMPLE_TIME ||
      metricType === AutoStopMetricTypes.CONNECTION_TIME
    ) {
      return [
        { value: AutoStopAggregations.MIN, label: 'Minimum' },
        { value: AutoStopAggregations.MAX, label: 'Maximum' },
        { value: AutoStopAggregations.MEAN, label: 'Mean (Average)' },
        { value: AutoStopAggregations.PERCENTILE, label: 'Percentile' }
      ];
    }
    if (
      metricType === AutoStopMetricTypes.SAMPLES ||
      metricType === AutoStopMetricTypes.SENT_BYTES ||
      metricType === AutoStopMetricTypes.RECEIVED_BYTES
    ) {
      return [
        { value: AutoStopAggregations.TOTAL, label: 'Total' },
        { value: AutoStopAggregations.PER_SECOND, label: 'Per Second' }
      ];
    }
    if (metricType === AutoStopMetricTypes.ERRORS) {
      return [
        { value: AutoStopAggregations.TOTAL, label: 'Total' },
        { value: AutoStopAggregations.PER_SECOND, label: 'Per Second' },
        { value: AutoStopAggregations.PERCENT, label: 'Percent' }
      ];
    }
    return [];
  };

  const getThresholdSuffix = () => {
    if (!metricType || !aggregation) return '';
    if (
      metricType === AutoStopMetricTypes.LATENCY_TIME ||
      metricType === AutoStopMetricTypes.SAMPLE_TIME ||
      metricType === AutoStopMetricTypes.CONNECTION_TIME
    ) {
      return 'ms';
    }
    if (
      metricType === AutoStopMetricTypes.ERRORS &&
      aggregation === AutoStopAggregations.PERCENT
    ) {
      return '%';
    }
    if (
      metricType === AutoStopMetricTypes.SAMPLES &&
      aggregation === AutoStopAggregations.PER_SECOND
    ) {
      return 'req/s';
    }
    return '';
  };

  const getThresholdConfig = () => {
    const isPercent =
      metricType === AutoStopMetricTypes.ERRORS &&
      aggregation === AutoStopAggregations.PERCENT;
    return { step: isPercent ? 0.1 : 1, precision: isPercent ? 1 : 0 };
  };
  const { step, precision } = getThresholdConfig();
  
  // Determine if we need to show the percentile field
  const showPercentile = 
    metricType && 
    ['latencyTime', 'sampleTime', 'connectionTime'].includes(metricType) &&
    aggregation === 'percentile';

  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '12px',
        position: 'relative'
      }}
    >
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => remove(index)}
        style={{ position: 'absolute', top: '8px', right: '8px' }}
      />

      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Metric Type - Always visible */}
        <Form.Item
          name={[...namePrefix, 'metricType']}
          label="Metric"
          rules={[{ required: true, message: 'Please select a metric' }]}
          preserve={true}
        >
          <Select>
            <Select.Option value={AutoStopMetricTypes.LATENCY_TIME}>
              Latency Time
            </Select.Option>
            <Select.Option value={AutoStopMetricTypes.SAMPLE_TIME}>
              Sample Time
            </Select.Option>
            <Select.Option value={AutoStopMetricTypes.CONNECTION_TIME}>
              Connection Time
            </Select.Option>
            <Select.Option value={AutoStopMetricTypes.SAMPLES}>
              Sample Count
            </Select.Option>
            <Select.Option value={AutoStopMetricTypes.ERRORS}>Errors</Select.Option>
            <Select.Option value={AutoStopMetricTypes.SENT_BYTES}>
              Sent Bytes
            </Select.Option>
            <Select.Option value={AutoStopMetricTypes.RECEIVED_BYTES}>
              Received Bytes
            </Select.Option>
          </Select>
        </Form.Item>

        {/* Aggregation - Conditionally visible but always in DOM */}
        <Form.Item
          name={[...namePrefix, 'aggregation']}
          label="Aggregation"
          rules={[{ required: !!metricType, message: 'Please select aggregation' }]}
          preserve={true}
          style={{ display: metricType ? 'block' : 'none' }}
        >
          <Select options={getAggregationOptions()} />
        </Form.Item>

        {/* Percentile - Conditionally visible but always in DOM */}
        <Form.Item
          name={[...namePrefix, 'percentile']}
          label="Percentile"
          rules={[{ required: showPercentile, message: 'Please enter percentile' }]}
          initialValue={90}
          preserve={true}
          style={{ display: showPercentile ? 'block' : 'none' }}
        >
          <InputNumber
            min={1}
            max={99}
            step={1}
            precision={0}
            addonAfter="%"
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* Comparison - Always visible */}
        <Form.Item
          name={[...namePrefix, 'comparison']}
          label="Comparison"
          rules={[{ required: true, message: 'Please select comparison' }]}
          initialValue={AutoStopComparisons.GREATER_THAN_OR_EQUAL}
          preserve={true}
        >
          <Select>
            <Select.Option value={AutoStopComparisons.LESS_THAN}>
              Less Than
            </Select.Option>
            <Select.Option
              value={AutoStopComparisons.LESS_THAN_OR_EQUAL}
            >
              Less Than or Equal
            </Select.Option>
            <Select.Option value={AutoStopComparisons.GREATER_THAN}>
              Greater Than
            </Select.Option>
            <Select.Option
              value={AutoStopComparisons.GREATER_THAN_OR_EQUAL}
            >
              Greater Than or Equal
            </Select.Option>
          </Select>
        </Form.Item>

        {/* Threshold Value - Always visible */}
        <Form.Item
          name={[...namePrefix, 'thresholdValue']}
          label="Threshold Value"
          rules={[{ required: true, message: 'Please enter threshold' }]}
          tooltip={
            metricType === AutoStopMetricTypes.LATENCY_TIME ||
            metricType === AutoStopMetricTypes.SAMPLE_TIME ||
            metricType === AutoStopMetricTypes.CONNECTION_TIME
              ? 'Value in milliseconds'
              : metricType === AutoStopMetricTypes.ERRORS &&
                aggregation === AutoStopAggregations.PERCENT
              ? 'Value in percentage'
              : ''
          }
          preserve={true}
        >
          <InputNumber
            min={0}
            step={step}
            precision={precision}
            addonAfter={getThresholdSuffix()}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* Advanced Options - Always visible */}
        <Space style={{ width: '100%', display: 'flex' }} wrap>
          <Form.Item
            name={[...namePrefix, 'holdForDuration']}
            label="Hold For"
            tooltip="Duration condition must be met"
            preserve={true}
          >
            <InputNumber
              min={0}
              addonAfter="seconds"
              style={{ minWidth: '150px' }}
            />
          </Form.Item>

          <Form.Item
            name={[...namePrefix, 'aggregationResetPeriod']}
            label="Reset Aggregation Every"
            tooltip="Reset period for aggregation"
            preserve={true}
          >
            <InputNumber
              min={0}
              addonAfter="seconds"
              style={{ minWidth: '150px' }}
            />
          </Form.Item>
        </Space>
      </Space>
    </div>
  );
};

export default AutoStopCondition;