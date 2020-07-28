import { Col } from 'antd'

const LabelAndData = (props) => {
  const { label, xsSpan, smSpan, mdSpan, data } = props
  return (
    <Col xs={xsSpan || 24} sm={smSpan || 12} md={mdSpan || 12}>
      <div className='tinyLabel'>{label}</div>
      <div>{data}</div>
    </Col>
  )
}
export default LabelAndData
