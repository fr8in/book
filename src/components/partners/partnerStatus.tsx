
import { Checkbox, Card, Row, Col } from 'antd'

const PartnerStatus = () => {
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }
  return (
    <Card size='small' className='mb10'>
      <Row>
        <Col xs={8}><Checkbox onChange={onChange}>BlackList</Checkbox> </Col>
        <Col xs={9}><Checkbox onChange={onChange}> De-activate</Checkbox></Col>
        <Col xs={7}><Checkbox onChange={onChange}>DND</Checkbox> </Col>
      </Row>
    </Card>
  )
}

export default PartnerStatus
