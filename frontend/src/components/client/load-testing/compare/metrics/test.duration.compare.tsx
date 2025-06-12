import type {ICompareTestRun} from "../type.compare.tsx";
import {Card, Col, Row, Statistic} from "antd";

const TestDurationComparison = (props: ICompareTestRun) => {
    const {testRun1, testRun2} = props;
    return (
        <>
            <Card type="inner" title="Test Duration">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={testRun1.title}
                            value={(testRun1.stats.duration / 1000).toFixed(2)}
                            suffix="s"
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={testRun2.title}
                            value={(testRun2.stats.duration / 1000).toFixed(2)}
                            suffix="s"
                        />
                    </Col>
                </Row>
            </Card>
        </>
    )
};
export default TestDurationComparison;