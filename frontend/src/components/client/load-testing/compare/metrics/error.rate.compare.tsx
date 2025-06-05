import {calculateDifference, type ICompareTestRun} from "../type.compare.tsx";
import {Card, Col, Row, Statistic, Typography} from "antd";


const ErrorRateComparison = (props: ICompareTestRun) => {
    const {testRun1, testRun2} = props;
    const {Text} = Typography;
    return (
        <>
            <Card type="inner" title="Error Rate">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={testRun1.title}
                            value={(testRun1.stats.errorRate * 100).toFixed(2)}
                            suffix="%"
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={testRun2.title}
                            value={(testRun2.stats.errorRate * 100).toFixed(2)}
                            suffix="%"
                            valueStyle={{
                                color: testRun2.stats.errorRate < testRun1.stats.errorRate ? '#3f8600' :
                                    testRun2.stats.errorRate > testRun1.stats.errorRate ? '#cf1322' : 'inherit'
                            }}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                    {testRun1.stats.errorRate !== testRun2.stats.errorRate && (
                        <Text type={testRun2.stats.errorRate < testRun1.stats.errorRate ? "success" : "danger"}>
                            {calculateDifference(testRun1.stats.errorRate, testRun2.stats.errorRate).value.toFixed(2)}%
                            {testRun2.stats.errorRate < testRun1.stats.errorRate ? " improvement" : " degradation"}
                        </Text>
                    )}
                </div>
            </Card>
        </>
    )
};
export default ErrorRateComparison;