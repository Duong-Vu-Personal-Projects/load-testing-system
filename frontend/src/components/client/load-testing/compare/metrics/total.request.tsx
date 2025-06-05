import {calculateDifference, type ICompareTestRun} from "../type.compare.tsx";
import {Card, Col, Row, Statistic, Typography} from "antd";


const TotalRequestComparison = (props: ICompareTestRun) => {
    const {testRun1, testRun2} = props;
    const {Text} = Typography;
    return (
        <>
            <Card type="inner" title="Total Requests">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={testRun1.title}
                            value={testRun1.stats.sampleCounts}
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={testRun2.title}
                            value={testRun2.stats.sampleCounts}
                            valueStyle={{
                                color: testRun2.stats.sampleCounts > testRun1.stats.sampleCounts ? '#3f8600' :
                                    testRun2.stats.sampleCounts < testRun1.stats.sampleCounts ? '#cf1322' : 'inherit'
                            }}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                    {testRun1.stats.sampleCounts !== testRun2.stats.sampleCounts && (
                        <Text type={testRun2.stats.sampleCounts > testRun1.stats.sampleCounts ? "success" : "danger"}>
                            {calculateDifference(testRun1.stats.sampleCounts, testRun2.stats.sampleCounts).value.toFixed(2)}%
                            {testRun2.stats.sampleCounts > testRun1.stats.sampleCounts ? " increase" : " decrease"}
                        </Text>
                    )}
                </div>
            </Card>
        </>
    )
};
export default TotalRequestComparison;