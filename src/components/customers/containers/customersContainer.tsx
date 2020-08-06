import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import Customers from '../customers'

import { gql, useQuery } from '@apollo/client'

const CUSTOMERS_QUERY = gql`
  query customers(
    $offset: Int!
    $limit: Int!
    $statusId: [Int!]
    $name: String
    $mobile: String
  ) {
    customer(
      offset: $offset
      limit: $limit
      where: {
        status: { id: { _in: $statusId } }
        mobile: { _like: $mobile }
        name: { _ilike: $name }
      }
    ) {
      cardcode
      customer_users {
        id
        name
      }
      name
      mobile
      type_id
      created_at
      pan
      advancePercentage {
        id
        name
      }
      status {
        id
        name
      }
    }
    customer_aggregate(
      where: {
        status: { id: { _in: $statusId } }
        name: { _ilike: $name }
        mobile: { _like: $mobile }
      }
    ) {
      aggregate {
        count
      }
    }
    customer_status(order_by: { id: asc }) {
      id
      name
    }
  }
`

const CustomersContainer = () => {
  const initialFilter = {
    statusId: [3],
    name: null,
    mobile: null,
    offset: 0,
    limit: 10
  }
  const [filter, setFilter] = useState(initialFilter)

  const customersQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    statusId: filter.statusId,
    name: filter.name ? `%${filter.name}%` : null,
    mobile: filter.mobile ? `%${filter.mobile}%` : null
  }

  const { loading, error, data } = useQuery(CUSTOMERS_QUERY, {
    variables: customersQueryVars,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('CustomersContainer error', error)
  var customer = []
  var customer_status = []
  var customer_aggregate = 0
  if (!loading) {
    customer = data && data.customer
    customer_status = data && data.customer_status
    customer_aggregate = data && data.customer_aggregate
  }

  const customer_status_list = customer_status && customer_status.filter((data) => data.id !== 8)

  const record_count =
    customer_aggregate.aggregate && customer_aggregate.aggregate.count
  const total_page = Math.ceil(record_count / filter.limit)

  console.log('record_count', record_count)
  const onFilter = (value) => {
    setFilter({ ...filter, statusId: value })
  }

  const onNameSearch = (value) => {
    setFilter({ ...filter, name: value })
  }

  const onMobileSearch = (value) => {
    setFilter({ ...filter, mobile: value })
  }

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }

  return (
    <Row>
      <Col sm={24}>
        <Card size='small' className='card-body-0 border-top-blue'>
          <Customers
            customers={customer}
            customer_status_list={customer_status_list}
            record_count={record_count}
            total_page={total_page}
            filter={filter}
            onFilter={onFilter}
            onNameSearch={onNameSearch}
            onMobileSearch={onMobileSearch}
            onPageChange={onPageChange}
            loading={loading}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default CustomersContainer
