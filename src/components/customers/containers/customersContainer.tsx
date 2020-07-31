import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import CustomerKyc from '../customerKyc'

import { useQuery } from '@apollo/client'
import { CUSTOMERS_QUERY } from './query/customersQuery'
import Loading from '../../common/loading'

const CustomersContainer = () => {
  const initialFilter = { statusId: [1, 2, 3, 4], name: null, mobile: null }
  const [filter, setFilter] = useState(initialFilter)

  const customersQueryVars = {
    offset: 0,
    limit: 20,
    statusId: filter.statusId,
    name: filter.name ? `%${filter.name}%` : null,
    mobile: filter.mobile ? `%${filter.mobile}%` : null
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

  const onFilter = (value) => {
    setFilter({ ...filter, statusId: value })
  }

  const onNameSearch = (value) => {
    setFilter({ ...filter, name: value })
  }

  const onMobileSearch = (value) => {
    setFilter({ ...filter, mobile: value })
  }

  return (
    <Row>
      <Col sm={24}>
        <Card size='small' className='card-body-0 border-top-blue'>
          <CustomerKyc
            customers={customer}
            status={customerStatusList}
            onLoadMore={loadMore}
            recordCount={recordCount}
            filter={filter}
            onFilter={onFilter}
            onNameSearch={onNameSearch}
            onMobileSearch={onMobileSearch}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default CustomersContainer
