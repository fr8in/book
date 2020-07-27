
import { Checkbox, Row, Col } from 'antd'

const PartnerStatus = () => {
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <Row>
      <Col xs={8}><Checkbox onChange={onChange}>BlackList</Checkbox> </Col>
      <Col xs={9}><Checkbox onChange={onChange}> De-activate</Checkbox></Col>
      <Col xs={7}><Checkbox onChange={onChange}>DND</Checkbox> </Col>
    </Row>
  )
}

export default PartnerStatus
