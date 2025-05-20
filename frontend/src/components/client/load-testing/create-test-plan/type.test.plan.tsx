export interface IThreadStageGroup {
    url: string;
    isFollowRedirects: boolean;
    rampDuration: number;
    holdDuration: number;
    rampToThreads: number;
    throughputTimer: number;
    holdIteration: number;
}

export interface IRpsThreadStageGroup {
    url: string;
    isFollowRedirects: boolean;
    rampDuration: number;
    holdDuration: number;
    rampToThreads: number;
    throughputTimer: number;
    maxThreads: number;
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
    httpMethod: string;
    followRedirects: boolean;
    headers: { key: string; value: string }[];
    requestBody?: string;
    contentType?: string;
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
    threadStageGroups: IThreadStageGroup[];
    rpsThreadStageGroups: IRpsThreadStageGroup[];
    stats: ITestResultStats;
}