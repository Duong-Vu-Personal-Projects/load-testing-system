import {Card, Col, Row, Statistic, Typography} from "antd";
import {
    calculateDifference, type ICompareTestRun,
} from "../type.compare.tsx";
const MedianResponseTimeComparison = (props: ICompareTestRun) => {
    const {Text } = Typography;
    const {testRun1, testRun2} = props;
    return (
        <>
            <Card type="inner" title="Median Response Time">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title="Run 1"
                            value={testRun1.stats.medianResponseTime}
                            suffix="ms"
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title="Run 2"
                            value={testRun2.stats.medianResponseTime}
                            suffix="ms"
                            valueStyle={{
                                color: testRun2.stats.medianResponseTime < testRun1.stats.medianResponseTime ? '#3f8600' :
                                    testRun2.stats.medianResponseTime > testRun1.stats.medianResponseTime ? '#cf1322' : 'inherit'
                            }}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                    {testRun1.stats.medianResponseTime !== testRun2.stats.medianResponseTime && (
                        <Text type={testRun2.stats.medianResponseTime < testRun1.stats.medianResponseTime ? "success" : "danger"}>
                            {calculateDifference(testRun1.stats.medianResponseTime, testRun2.stats.medianResponseTime).value.toFixed(2)}%
                            {testRun2.stats.medianResponseTime < testRun1.stats.medianResponseTime ? " faster" : " slower"}
                        </Text>
                    )}
                </div>
            </Card>
        </>
    )
};
export default MedianResponseTimeComparison;