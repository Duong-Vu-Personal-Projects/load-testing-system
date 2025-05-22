import type {ITestResultDetail} from "../create-test-plan/type.test.plan.tsx";

export interface ICompareTestRun {
    testRun1: ITestResultDetail;
    testRun2: ITestResultDetail;
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