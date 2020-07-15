import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import InlineEdit from '../../common/inlineEdit'
import Blacklist from '../blacklist'
import CustomerInfo from '../customerInfo'

const CustomerDetailContainer = (props) => {
  console.log('object', props)
  const [storedHeading, setStoredHeading] = useState(
    'Click here to start editing the text!'
  )
  const onCustomerNameSave = (value) => {
    console.log('value', value)
  }
  return (
    <Card
      size='small'
      title={
        <InlineEdit
          text={storedHeading}
          onSetText={text => setStoredHeading(text)}
          onSubmit={onCustomerNameSave}
        />
      }
      extra={<Blacklist />}
    >
      <Row gutter={[10, 10]}>
        <Col sm={14}>
          <CustomerInfo {...props} />
        </Col>
        <Col xs={10} />
      </Row>
    </Card>
  )
}

export default CustomerDetailContainer
