import { Col } from 'antd'

const LabelAndData = (props) => {
  const { label, colSpan, data } = props
  return (
    <Col xs={24} sm={colSpan || 12}>
      <div>{label}</div>
      <div>{data}</div>
    </Col>
  )
}
export default LabelAndData
