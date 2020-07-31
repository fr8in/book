import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import CustomerKyc from '../customerKyc'

import { gql, useQuery } from '@apollo/client'

const CUSTOMERS_QUERY = gql`
  query customers($offset: Int!, $limit: Int!, $statusId:[Int!], $name:String, $mobile:String) {
    customer(
      offset: $offset, 
      limit: $limit,
      where: { 
        status: {
          id: {_in: $statusId},
        },
        name: {_ilike: $name},
        mobile: {_like: $mobile}
      }
    ) {
      cardcode
      customerUsers{
        id
        name
      }
      name
      mobile
      type_id
      created_at
      pan
      advancePercentage{
        id
        value
      }
      status {
        id
        value
      }
    }
    customer_aggregate {
      aggregate {
        count
      }
    }
    customer_status(order_by: {id:asc}){
      id
      value
    }
  }
`

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

  console.log('CustomersContainer error', error)
  var customer = []
  var customer_status = []
  var customer_aggregate = 0
  if (!loading) {
    customer = data && data.customer
    customer_status = data && data.customer_status
    customer_aggregate = data && data.customer_aggregate
  }
  console.log('customer', customer)

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
  console.log('recordCount', recordCount)
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
            loading={loading}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default CustomersContainer
