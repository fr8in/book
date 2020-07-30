import { useState } from 'react'
import { Row, Col, Card, Dropdown, Menu, Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import CustomerKyc from '../customerKyc'

import { useQuery } from '@apollo/client'
import { CUSTOMERS_QUERY } from './query/customersQuery'
import Loading from '../../common/loading'

const CustomersContainer = () => {
  const initialStatus = [1, 2, 3, 4]
  const [statusId, setStatusId] = useState(initialStatus)
  const [dropVisible, setDropVisible] = useState(false)

  const customersQueryVars = {
    offset: 0,
    limit: 20,
    statusId: statusId
  }

  const { loading, error, data, fetchMore } = useQuery(
    CUSTOMERS_QUERY,
    {
      variables: customersQueryVars,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  if (loading) return <Loading />
  console.log('CustomersContainer error', error)

  const { customer, customer_status, customer_aggregate } = data

  const loadMore = () => fetchMore({
    variables: {
      offset: customer.length
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      console.log('prev', prev, 'fetchmore', fetchMoreResult)
      if (!fetchMoreResult) return prev
      return Object.assign({}, prev, {
        customer: [...prev.customer, ...fetchMoreResult.customer]
      })
    }
  })

  const removeLeadStatus = customer_status.filter(data => data.id !== 8)
  const customerStatusList = removeLeadStatus.map(data => {
    return { value: data.id, text: data.value }
  })
  const recordCount = customer_aggregate.aggregate && customer_aggregate.aggregate.count

  const handleVisibleChange = flag => setDropVisible(flag)
  const searchField = (
    <div className='search-field'>
      <Input
        placeholder='Search...'
        prefix={<SearchOutlined />}
      />
    </div>
  )

  return (
    <Row>
      <Col sm={24}>
        <Card size='small' className='card-body-0 border-top-blue search'>
          <Dropdown
            onVisibleChange={handleVisibleChange}
            overlay={searchField}
            className='search-drop'
            trigger={['click']}
            visible={dropVisible}
          >
            <Button type='primary' icon={<SearchOutlined />} onClick={e => e.preventDefault()} />
          </Dropdown>
          <CustomerKyc
            onLoadMore={loadMore}
            customers={customer}
            status={customerStatusList}
            statusId={statusId}
            recordCount={recordCount}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default CustomersContainer
