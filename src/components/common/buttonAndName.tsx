import { Col } from 'antd'

const ButtonAndName = (props) => {
  const { label, xsSpan, smSpan, mdSpan, data } = props
  return (
    <Col xs={xsSpan || 24} sm={smSpan || 12} md={mdSpan || 12}>
      <div>{label}</div>
      <div className='tinyLabel'>{data}</div>
    </Col>
  )
}
export default ButtonAndName
