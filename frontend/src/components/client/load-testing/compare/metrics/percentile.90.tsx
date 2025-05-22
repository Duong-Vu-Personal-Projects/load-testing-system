import {Card, Col, Row, Statistic, Typography} from "antd";
import {calculateDifference, type ICompareTestRun} from "../type.compare.tsx";

const Percentile90Comparison = (props: ICompareTestRun) => {
    const {Text} = Typography;
    const {testRun1, testRun2} = props;
    return (
        <>
            <Card type="inner" title="90th Percentile">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title="Run 1"
                            value={testRun1.stats.sampleTimePercentile90}
                            suffix="ms"
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title="Run 2"
                            value={testRun2.stats.sampleTimePercentile90}
                            suffix="ms"
                            valueStyle={{
                                color: testRun2.stats.sampleTimePercentile90 < testRun1.stats.sampleTimePercentile90 ? '#3f8600' :
                                    testRun2.stats.sampleTimePercentile90 > testRun1.stats.sampleTimePercentile90 ? '#cf1322' : 'inherit'
                            }}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                    {testRun1.stats.sampleTimePercentile90 !== testRun2.stats.sampleTimePercentile90 && (
                        <Text type={testRun2.stats.sampleTimePercentile90 < testRun1.stats.sampleTimePercentile90 ? "success" : "danger"}>
                            {calculateDifference(testRun1.stats.sampleTimePercentile90, testRun2.stats.sampleTimePercentile90).value.toFixed(2)}%
                            {testRun2.stats.sampleTimePercentile90 < testRun1.stats.sampleTimePercentile90 ? " faster" : " slower"}
                        </Text>
                    )}
                </div>
            </Card>
        </>
    )
}
export default Percentile90Comparison;