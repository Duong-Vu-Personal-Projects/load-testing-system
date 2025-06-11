import {calculateDifference, type ICompareTestRun} from "../type.compare.tsx";
import {Card, Col, Row, Statistic, Typography} from "antd";

const ErrorRateComparison = (props: ICompareTestRun) => {
    const {testRun1, testRun2} = props;
    const {Text} = Typography;

    const errorRate1 = testRun1.stats.errorRate;
    const errorRate2 = testRun2.stats.errorRate;
    const errorRate1Percent = (errorRate1 * 100).toFixed(2);
    const errorRate2Percent = (errorRate2 * 100).toFixed(2);

    let diffDisplay = null;
    if (errorRate1 !== errorRate2) {
        if (errorRate1 === 0) {
            // If baseline is 0, show absolute difference
            diffDisplay = (
                <Text type={errorRate2 === 0 ? "secondary" : "danger"}>
                    +{(errorRate2 * 100).toFixed(2)}% degradation
                </Text>
            );
        } else {
            const diff = calculateDifference(errorRate1, errorRate2);
            diffDisplay = (
                <Text type={errorRate2 < errorRate1 ? "success" : "danger"}>
                    {diff.value.toFixed(2)}%
                    {errorRate2 < errorRate1 ? " improvement" : " degradation"}
                </Text>
            );
        }
    }

    return (
        <>
            <Card type="inner" title="Error Rate">
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic
                            title={testRun1.title}
                            value={errorRate1Percent}
                            suffix="%"
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title={testRun2.title}
                            value={errorRate2Percent}
                            suffix="%"
                            valueStyle={{
                                color: errorRate2 < errorRate1 ? '#3f8600' :
                                    errorRate2 > errorRate1 ? '#cf1322' : 'inherit'
                            }}
                        />
                    </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                    {diffDisplay}
                </div>
            </Card>
        </>
    )
};
export default ErrorRateComparison;