import { Tabs, Row, Col, Card } from 'antd'
import Customers from '../customers'
import CustomerKyc from '../customerKyc'

import { useQuery } from '@apollo/client'
import { CUSTOMERS_QUERY } from './query/customersQuery'
import Loading from '../../common/loading'

const TabPane = Tabs.TabPane

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

  const { customer } = data

  return (
    <Row>
      <Col sm={24}>
        <Card size='small' className='card-body-0 border-top-blue'>
          <Tabs>
            <TabPane tab='Customers' key='1'>
              <Customers customers={customer} />
            </TabPane>
            <TabPane tab='Approval Pending' key='2'>
              <CustomerKyc />
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  )
}

export default CustomersContainer
