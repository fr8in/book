import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import InlineEdit from '../../common/inlineEdit'
import Blacklist from '../blacklist'
import CustomerInfo from '../customerInfo'
import { useQuery } from '@apollo/react-hooks'
import { CUSTOMER_INFO_QUERY } from '../query/cutomerQuery'

const CustomerDetailContainer = (props) => {
  const { cardCode } = props
  const { loading, error, data } = useQuery(
    CUSTOMER_INFO_QUERY,
    {
      variables: { cardCode },
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true
    }
  )

  // if (error) return <ErrorMessage message="Error loading posts." />
  if (loading) return <div>Loading</div>
  const { customer } = data
  const customerInfo = customer[0] ? customer[0] : { name: 'ID does not exist' }

  const initial = { name: customerInfo.name }
  const [value, setValue] = useState(initial)

  const onCustomerNameSave = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
  }

  const textChangeHandle = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
  }

  return (
    <Card
      size='small'
      title={
        <InlineEdit
          text={value.name}
          onSetText={text => textChangeHandle('name', text)}
          objKey='name'
          onSubmit={onCustomerNameSave}
        />
      }
      extra={<Blacklist cardCode={customerInfo.cardCode} statusId={customerInfo.statusId} />}
    >
      <Row gutter={[10, 10]}>
        <Col sm={14}>
          <CustomerInfo customerInfo={customerInfo} />
        </Col>
        <Col xs={10}>
          
        </Col>
      </Row>
    </Card>
  )
}

export default CustomerDetailContainer
