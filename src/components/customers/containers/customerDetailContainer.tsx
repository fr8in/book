import { Row, Col, Card } from 'antd'
import Blacklist from '../blacklist'
import CustomerInfo from '../customerInfo'
import { useQuery } from '@apollo/react-hooks'
import { CUSTOMER_INFO_QUERY } from './query/cutomerInfoQuery'
import CustomerName from '../customerName'

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

  if (loading) return <div>Loading...</div>
  const { customer } = data
  const customerInfo = customer[0] ? customer[0] : { name: 'ID does not exist' }

  return (
    <Card
      size='small'
      title={
        <CustomerName cardCode={customerInfo.cardCode} name={customerInfo.name} />
      }
      extra={<Blacklist cardCode={customerInfo.cardCode} statusId={customerInfo.statusId} />}
    >
      <Row gutter={[10, 10]}>
        <Col sm={14}>
          <CustomerInfo customerInfo={customerInfo} />
        </Col>
        <Col xs={10} />
      </Row>
    </Card>
  )
}

export default CustomerDetailContainer
