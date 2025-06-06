package com.vn.ptit.duongvct.domain.testplan;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import us.abstracta.jmeter.javadsl.core.DslTestElement;
import us.abstracta.jmeter.javadsl.core.listeners.AutoStopListener;


import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static us.abstracta.jmeter.javadsl.JmeterDsl.autoStop;
import static us.abstracta.jmeter.javadsl.core.listeners.AutoStopListener.AutoStopCondition.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document
public class AutoStopConfig {
    private boolean enabled = false;
    private String name;
    private String samplePattern;
    private List<AutoStopCondition> conditions = new ArrayList<>();
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AutoStopCondition {
        /**
         * The type of metric to monitor.
         * Valid values: "sampleTime", "latencyTime", "connectionTime", "samples", "errors", "sentBytes", "receivedBytes"
         */
        private String metricType;

        /**
         * The aggregation method to use.
         * Valid values depend on the metric type:
         * - For time metrics (sampleTime, latencyTime, connectionTime): "min", "max", "mean", "percentile"
         * - For count metrics (samples, errors, sentBytes, receivedBytes): "total", "perSecond"
         * - For errors only: "percent", "total", "perSecond"
         */
        private String aggregation;

        /**
         * The percentile value (0-100) when using percentile aggregation.
         */
        private Double percentile;

        /**
         * The comparison type.
         * Valid values: "lessThan", "lessThanOrEqual", "greaterThan", "greaterThanOrEqual"
         */
        private String comparison;

        /**
         * The threshold value to compare against.
         * The type depends on the metric and aggregation:
         * - For time metrics: milliseconds (Long)
         * - For count metrics with "total": count (Long)
         * - For count metrics with "perSecond": rate (Double)
         * - For errors with "percent": percentage (Double)
         */
        private Object thresholdValue;

        /**
         * Optional duration for which the condition must hold true before triggering.
         * In seconds. If not specified or zero, the condition triggers immediately.
         */
        private Long holdForDuration;

        /**
         * Optional period after which aggregation is reset and reevaluated.
         * In seconds. Useful for mean, perSecond, and percent aggregations to prevent
         * historical values from hiding recent deviations.
         */
        private Long aggregationResetPeriod;

        /**
         * Converts this condition to a JMeter DSL auto-stop condition.
         */
        @JsonIgnore
        public AutoStopListener.AutoStopCondition toDslCondition() {
            AutoStopListener.AutoStopCondition condition = null;

            // Choose the metric type
            switch (metricType) {
                case "sampleTime":
                    condition = buildTimeCondition(sampleTime());
                    break;
                case "latencyTime":
                    condition = buildTimeCondition(latencyTime());
                    break;
                case "connectionTime":
                    condition = buildTimeCondition(connectionTime());
                    break;
                case "samples":
                    condition = buildCountCondition(samples());
                    break;
                case "errors":
                    condition = buildErrorCondition(errors());
                    break;
                case "sentBytes":
                    condition = buildCountCondition(sentBytes());
                    break;
                case "receivedBytes":
                    condition = buildCountCondition(receivedBytes());
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported metric type: " + metricType);
            }

            // Apply holdFor if specified
            if (condition != null && holdForDuration != null && holdForDuration > 0) {
                condition = condition.holdsFor(Duration.ofSeconds(holdForDuration));
            }

            return condition;
        }

        @JsonIgnore
        private AutoStopListener.AutoStopCondition buildTimeCondition(
                AutoStopListener.TimeMetricConditionBuilder builder) {

            AutoStopListener.AggregatedConditionBuilder<Duration> aggregatedBuilder = null;

            switch (aggregation) {
                case "min":
                    aggregatedBuilder = builder.min();
                    break;
                case "max":
                    aggregatedBuilder = builder.max();
                    break;
                case "mean":
                    aggregatedBuilder = builder.mean();
                    break;
                case "percentile":
                    if (percentile == null) {
                        throw new IllegalArgumentException("Percentile value must be specified for percentile aggregation");
                    }
                    aggregatedBuilder = builder.percentile(percentile);
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported aggregation for time metric: " + aggregation);
            }

            // Apply reset period if specified
            if (aggregationResetPeriod != null && aggregationResetPeriod > 0) {
                aggregatedBuilder = aggregatedBuilder.every(Duration.ofSeconds(aggregationResetPeriod));
            }

            // Apply comparison
            long millis = thresholdValue instanceof Number ? ((Number)thresholdValue).longValue() : 0;
            Duration duration = Duration.ofMillis(millis);

            switch (comparison) {
                case "lessThan":
                    return aggregatedBuilder.lessThan(duration);
                case "lessThanOrEqual":
                    return aggregatedBuilder.lessThanOrEqualTo(duration);
                case "greaterThan":
                    return aggregatedBuilder.greaterThan(duration);
                case "greaterThanOrEqual":
                    return aggregatedBuilder.greaterThanOrEqualTo(duration);
                default:
                    throw new IllegalArgumentException("Unsupported comparison: " + comparison);
            }
        }

        @JsonIgnore
        private AutoStopListener.AutoStopCondition buildCountCondition(
                AutoStopListener.CountMetricConditionBuilder builder) {

            AutoStopListener.AggregatedConditionBuilder<?> aggregatedBuilder = null;

            switch (aggregation) {
                case "total":
                    aggregatedBuilder = builder.total();
                    break;
                case "perSecond":
                    aggregatedBuilder = builder.perSecond();
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported aggregation for count metric: " + aggregation);
            }

            // Apply reset period if specified
            if (aggregationResetPeriod != null && aggregationResetPeriod > 0) {
                aggregatedBuilder = aggregatedBuilder.every(Duration.ofSeconds(aggregationResetPeriod));
            }

            // Apply comparison
            if (aggregation.equals("total")) {
                long value = thresholdValue instanceof Number ? ((Number)thresholdValue).longValue() : 0;

                switch (comparison) {
                    case "lessThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).lessThan(value);
                    case "lessThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).lessThanOrEqualTo(value);
                    case "greaterThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).greaterThan(value);
                    case "greaterThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).greaterThanOrEqualTo(value);
                    default:
                        throw new IllegalArgumentException("Unsupported comparison: " + comparison);
                }
            } else { // perSecond
                double value = thresholdValue instanceof Number ? ((Number)thresholdValue).doubleValue() : 0;

                switch (comparison) {
                    case "lessThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).lessThan(value);
                    case "lessThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).lessThanOrEqualTo(value);
                    case "greaterThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).greaterThan(value);
                    case "greaterThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).greaterThanOrEqualTo(value);
                    default:
                        throw new IllegalArgumentException("Unsupported comparison: " + comparison);
                }
            }
        }

        @JsonIgnore
        private AutoStopListener.AutoStopCondition buildErrorCondition(
                AutoStopListener.ErrorsConditionBuilder builder) {

            AutoStopListener.AggregatedConditionBuilder<?> aggregatedBuilder = null;

            switch (aggregation) {
                case "total":
                    aggregatedBuilder = builder.total();
                    break;
                case "perSecond":
                    aggregatedBuilder = builder.perSecond();
                    break;
                case "percent":
                    aggregatedBuilder = builder.percent();
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported aggregation for errors metric: " + aggregation);
            }

            // Apply reset period if specified
            if (aggregationResetPeriod != null && aggregationResetPeriod > 0) {
                aggregatedBuilder = aggregatedBuilder.every(Duration.ofSeconds(aggregationResetPeriod));
            }

            // Apply comparison
            if (aggregation.equals("total")) {
                long value = thresholdValue instanceof Number ? ((Number)thresholdValue).longValue() : 0;

                switch (comparison) {
                    case "lessThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).lessThan(value);
                    case "lessThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).lessThanOrEqualTo(value);
                    case "greaterThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).greaterThan(value);
                    case "greaterThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Long>)aggregatedBuilder).greaterThanOrEqualTo(value);
                    default:
                        throw new IllegalArgumentException("Unsupported comparison: " + comparison);
                }
            } else { // perSecond or percent
                double value = thresholdValue instanceof Number ? ((Number)thresholdValue).doubleValue() : 0;

                switch (comparison) {
                    case "lessThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).lessThan(value);
                    case "lessThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).lessThanOrEqualTo(value);
                    case "greaterThan":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).greaterThan(value);
                    case "greaterThanOrEqual":
                        return ((AutoStopListener.AggregatedConditionBuilder<Double>)aggregatedBuilder).greaterThanOrEqualTo(value);
                    default:
                        throw new IllegalArgumentException("Unsupported comparison: " + comparison);
                }
            }
        }
    }

    /**
     * Converts this configuration to a JMeter DSL auto-stop element.
     * @return A configured AutoStopListener, or null if auto-stop is disabled.
     */
    @JsonIgnore
    public DslTestElement toDslElement() {
        if (!enabled || conditions.isEmpty()) {
            return null;
        }

        AutoStopListener autoStopListener = name != null && !name.isEmpty()
                ? autoStop(name)
                : autoStop();

        // Apply sample pattern if specified
        if (samplePattern != null && !samplePattern.isEmpty()) {
            autoStopListener = autoStopListener.samplesMatching(samplePattern);
        }

        // Apply all conditions
        for (AutoStopCondition condition : conditions) {
            AutoStopListener.AutoStopCondition dslCondition = condition.toDslCondition();
            if (dslCondition != null) {
                autoStopListener = autoStopListener.when(dslCondition);
            }
        }

        return autoStopListener;
    }
}