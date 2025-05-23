import type {ITestResultStats} from "../create-test-plan/type.test.plan.tsx";
export interface IComparisonResultDetail {
    testRun1: ITestRunBasicInfo;
    testRun2: ITestRunBasicInfo;
    testPlanId: string;
    responseTimeComparison: IComparisonDataPoint[];
    throughputComparison: IComparisonDataPoint[];
    errorRateComparison: IErrorRateComparison;

}
export interface ITestRunBasicInfo {
    id: string;
    title: string;
    time: string;
    fileName: string;
    stats: ITestResultStats;
}
export interface IComparisonDataPoint {
    category: string;
    run: string;
    value: number
}
export interface IErrorRateComparison {
    run1ErrorRate: number;
    run2ErrorRate: number;
    run1Data: IPieChartData[];
    run2Data: IPieChartData[];
}
export interface IPieChartData{
    type: string;
    value: number;
}
export interface ICompareTestRun {
    testRun1: ITestRunBasicInfo;
    testRun2: ITestRunBasicInfo;
}
export const calculateDifference = (value1: number, value2: number): { value: number, improved: boolean } => {
    if (value1 === 0 && value2 === 0) return { value: 0, improved: false };

    const diff = ((value2 - value1) / value1) * 100;
    // For response times, lower is better. For throughput metrics, higher is better
    const isResponseTimeMetric = true; // Adjust based on metric type
    const improved = isResponseTimeMetric ? diff < 0 : diff > 0;

    return {
        value: Math.abs(diff),
        improved
    };
};