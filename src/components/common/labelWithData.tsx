import { Row, Col } from 'antd'

const LabelWithData = (props) => {
  const { label, labelSpan, data, dataSpan } = props
  return (
    <Row gutter={6}>
      <Col xs={labelSpan || 12}>
        <label>{label}</label>
      </Col>
      <Col xs={dataSpan || 12}>
        {data}
      </Col>
    </Row>
  )
}
export default LabelWithData
