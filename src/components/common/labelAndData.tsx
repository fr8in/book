import { Col } from 'antd'

const LabelAndData = (props) => {
  const { label, colSpan, data } = props
  return (
    <Col xs={24} sm={colSpan || 12}>
      <p className='mb0 b'>{label}</p>
      {data}
    </Col>
  )
}
export default LabelAndData
