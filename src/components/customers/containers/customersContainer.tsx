import { Row, Col, Card } from 'antd'
import CustomerKyc from '../customerKyc'

import { useQuery } from '@apollo/client'
import { CUSTOMERS_QUERY } from './query/customersQuery'
import Loading from '../../common/loading'

export const customersQueryVars = {
  offset: 0,
  limit: 10
}

const CustomersContainer = () => {
  const { loading, error, data } = useQuery(
    CUSTOMERS_QUERY,
    {
      variables: customersQueryVars,
      notifyOnNetworkStatusChange: true
    }
  )

  if (loading) return <Loading />
  console.log('CustomersContainer error', error)

  const { customer, customer_status } = data

  return (
    <Row>
      <Col sm={24}>
        <Card size='small' className='card-body-0 border-top-blue'>
          <CustomerKyc customers={customer} status={customer_status} />
        </Card>
      </Col>
    </Row>
  )
}

export default CustomersContainer
