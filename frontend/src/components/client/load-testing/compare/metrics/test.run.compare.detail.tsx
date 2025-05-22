import type {ITestResultDetail} from "../../create-test-plan/type.test.plan.tsx";
import {Card, Descriptions} from "antd";
import dayjs from "dayjs";
interface ITestRun {
    testRun: ITestResultDetail
}
const TestRunCompareDetail = (props: ITestRun) => {
    const {testRun} = props;
    return (
        <>
            <Card title={`Run 1: ${testRun.title}`}>
                <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Time">
                        {dayjs(testRun.time).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="File">{testRun.fileName}</Descriptions.Item>
                </Descriptions>
            </Card>
        </>
    )
};
export default TestRunCompareDetail;