import {Card, Col, Row, Statistic, Typography} from "antd";
import {calculateDifference, type ICompareTestRun} from "../type.compare.tsx";

const Percentile99Comparison = (props: ICompareTestRun) => {
    const {Text} = Typography;
    const {testRun1, testRun2} = props;
    return (
        <>
            <Card type="inner" title="90th Percentile">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={testRun1.title}
                            value={testRun1.stats.sampleTimePercentile99}
                            suffix="ms"
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={testRun2.title}
                            value={testRun2.stats.sampleTimePercentile99}
                            suffix="ms"
                            valueStyle={{
                                color: testRun2.stats.sampleTimePercentile99 < testRun1.stats.sampleTimePercentile99 ? '#3f8600' :
                                    testRun2.stats.sampleTimePercentile99 > testRun1.stats.sampleTimePercentile99 ? '#cf1322' : 'inherit'
                            }}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                    {testRun1.stats.sampleTimePercentile99 !== testRun2.stats.sampleTimePercentile99 && (
                        <Text type={testRun2.stats.sampleTimePercentile99 < testRun1.stats.sampleTimePercentile99 ? "success" : "danger"}>
                            {calculateDifference(testRun1.stats.sampleTimePercentile99, testRun2.stats.sampleTimePercentile99).value.toFixed(2)}%
                            {testRun2.stats.sampleTimePercentile99 < testRun1.stats.sampleTimePercentile99 ? " faster" : " slower"}
                        </Text>
                    )}
                </div>
            </Card>
        </>
    )
}
export default Percentile99Comparison;