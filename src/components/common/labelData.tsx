import { Row, Col } from 'antd'

const LabelWithData = (props) => {
  const { label, labelSpan, data, dataSpan,iconSpan,icon,valueSpan,value } = props
  return (
    <Row gutter={6}>
      <Col xs={iconSpan || 1}>
        <label>{icon}</label>
      </Col>
      <Col xs={labelSpan || 5}>
        {label}
      </Col>
      <Col xs={valueSpan || 17}>
        {value}
      </Col>
      <Col xs={dataSpan || 1}>
        {data}
      </Col>
    </Row>
  )
}
export default LabelWithData