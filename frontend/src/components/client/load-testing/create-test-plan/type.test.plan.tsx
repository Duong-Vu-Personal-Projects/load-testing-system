export interface IThreadStageGroup {
    url: string;
    followRedirects: boolean;
    rampDuration: number;
    holdDuration: number;
    rampToThreads: number;
    throughputTimer: number;
    holdIteration: number;
    autoStop?: IAutoStopConfig;
}

export interface IRpsThreadStageGroup {
    url: string;
    followRedirects: boolean;
    rampDuration: number;
    holdDuration: number;
    rampToThreads: number;
    throughputTimer: number;
    maxThreads: number;
    autoStop?: IAutoStopConfig;
}
export interface IRequestCreateTestPlan {
    title: string,
    threadStageGroups: IThreadStageGroup[];
    rpsThreadStageGroups: IRpsThreadStageGroup[];
    globalAutoStop?: IAutoStopConfig;
}
export interface IRequestRunTestPlan {
    id: string;
}
export interface ITestPlan {
    id: string,
    title: string,
    threadStageGroups: IThreadStageGroup[],
    rpsThreadStageGroups: IRpsThreadStageGroup[]
    globalAutoStop?: IAutoStopConfig;
}
export interface IHttpConfig {
    httpMethod: string;
    followRedirects: boolean;
    headers: { key: string; value: string }[];
    requestBody?: string;
    contentType?: string;
}

export interface ITestPlanFormValues {
    title: string;
    threadStageGroups: IThreadStageGroup[];
    rpsThreadStageGroups: IRpsThreadStageGroup[];
    globalAutoStop?: IAutoStopConfig;
}

export interface ITestResultStats {
    errorCount: number;
    sampleCounts: number;
    errorRate: number;
    receivedBytes: number;
    sentBytes: number;
    duration: number;
    sampleTimePercentile99: number;
    sampleTimePercentile90: number;
    sampleTimePercentile95: number;
    maxResponseTime: number;
    minResponseTime: number;
    medianResponseTime: number;
}

export interface ITestResult {
    id: string;
    title: string;
    time: string;
    fileName: string;
    testPlan: ITestPlan,
    stats: ITestResultStats;
}
export interface ITestResultDetail {
    id: string;
    title: string;
    time: string; // ISO string format of LocalDateTime
    fileName: string;
    testPlan: ITestPlan,
    resultDTO: ITestResultDTO;
    stats: ITestResultStats;
}
export interface ITestResultDTO {
    id: string;
    timeStamps: number[];
    elapsedTimes: number[];
    labels: string[];
    responseCodes: number[];
    responseMessages: string[];
    threadNames: string[];
    dataTypes: string[];
    successes: boolean[];
    failureMessages: string[];
    bytes: number[];
    sentBytes: number[];
    grpThreads: number[];
    allThreads: number[];
    urls: string[];
    latencies: number[];
    idleTimes: number[];
    connectTimes: number[];
    relativeTimes: number[];
    readableTimes: string[];

    // Aggregated statistics
    errorCount: number;
    sampleCount: number;
    errorRate: number;

    // Throughput data: [second, count]
    throughputData: Array<[number, number]>;
}
export type AutoStopMetricType =
    | 'latencyTime'
    | 'sampleTime'
    | 'connectionTime'
    | 'samples'
    | 'errors'
    | 'sentBytes'
    | 'receivedBytes';

export type AutoStopAggregation =
    | 'min'
    | 'max'
    | 'mean'
    | 'percentile'
    | 'total'
    | 'perSecond'
    | 'percent';

export type AutoStopComparison =
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'greaterThan'
    | 'greaterThanOrEqual';

export interface IAutoStopCondition {
    metricType: AutoStopMetricType;
    aggregation: AutoStopAggregation;
    percentile?: number; // Only used when aggregation is PERCENTILE
    comparison: AutoStopComparison;
    thresholdValue: number;
    holdForDuration?: number; // In seconds
    aggregationResetPeriod?: number; // In seconds
}

export interface IAutoStopConfig {
    enabled: boolean;
    name?: string;
    samplePattern?: string;
    conditions: IAutoStopCondition[];
}
export const AutoStopMetricTypes = {
    LATENCY_TIME: 'latencyTime' as AutoStopMetricType,
    SAMPLE_TIME: 'sampleTime' as AutoStopMetricType,
    CONNECTION_TIME: 'connectionTime' as AutoStopMetricType,
    SAMPLES: 'samples' as AutoStopMetricType,
    ERRORS: 'errors' as AutoStopMetricType,
    SENT_BYTES: 'sentBytes' as AutoStopMetricType,
    RECEIVED_BYTES: 'receivedBytes' as AutoStopMetricType
};

export const AutoStopAggregations = {
    MIN: 'min' as AutoStopAggregation,
    MAX: 'max' as AutoStopAggregation,
    MEAN: 'mean' as AutoStopAggregation,
    PERCENTILE: 'percentile' as AutoStopAggregation,
    TOTAL: 'total' as AutoStopAggregation,
    PER_SECOND: 'perSecond' as AutoStopAggregation,
    PERCENT: 'percent' as AutoStopAggregation
};

export const AutoStopComparisons = {
    LESS_THAN: 'lessThan' as AutoStopComparison,
    LESS_THAN_OR_EQUAL: 'lessThanOrEqual' as AutoStopComparison,
    GREATER_THAN: 'greaterThan' as AutoStopComparison,
    GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual' as AutoStopComparison
};