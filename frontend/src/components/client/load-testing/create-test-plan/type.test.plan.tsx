export interface IThreadStageGroup {
    url: string;
    followRedirects: boolean;
    rampDuration: number;
    holdDuration: number;
    rampToThreads: number;
    throughputTimer: number;
    holdIteration: number;
}

export interface IRpsThreadStageGroup {
    url: string;
    followRedirects: boolean;
    rampDuration: number;
    holdDuration: number;
    rampToThreads: number;
    throughputTimer: number;
    maxThreads: number;
}
export interface IRequestCreateTestPlan {
    title: string,
    threadStageGroups: IThreadStageGroup[],
    rpsThreadStageGroups: IRpsThreadStageGroup[]
}
export interface IRequestRunTestPlan {
    id: string;
}
export interface ITestPlan {
    id: string,
    title: string,
    threadStageGroups: IThreadStageGroup[],
    rpsThreadStageGroups: IRpsThreadStageGroup[]
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