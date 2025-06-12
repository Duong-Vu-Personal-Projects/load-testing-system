import {Card, Descriptions} from "antd";
import dayjs from "dayjs";
import type {ITestRunBasicInfo} from "../type.compare.tsx";
interface ITestRun {
    testRun: ITestRunBasicInfo
}
const TestRunCompareDetail = (props: ITestRun) => {
    const {testRun} = props;
    return (
        <>
            <Card title={testRun.title}>
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