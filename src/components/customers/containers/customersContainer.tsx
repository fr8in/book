import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import Customers from '../customers'
import u from '../../../lib/util'
import get from 'lodash/get'

import { gql, useQuery } from '@apollo/client'

const CUSTOMERS_QUERY = gql`
  query customers($offset: Int!, $limit: Int!, $statusId: [Int!], $name: String, $mobile: String) {
  customer_user(where: {customer: {status: {id: {_in: $statusId}}}, mobile: {_like: $mobile}, name: {_ilike: $name}}, offset: $offset, limit: $limit) {
    id
    name
    mobile
    customer {
      cardcode
      name
      customer_type_id
      created_at
      pan
      customer_files{
        id
        type
        folder
        file_path
        created_at
        customer_id
      }
      status {
        id
        name
      }
      advance_percentage_id
      # advance_percentage{
      #   id
      #   name
      # }
      customer_type {
        name
      }
    }
  }
  customer_user_aggregate(where: {customer: {status: {id: {_in: $statusId}}}, mobile: {_like: $mobile}, name: {_ilike: $name}}) {
    aggregate {
      count
    }
  }
  customer_status(order_by: {id: asc}) {
    id
    name
  }
}
`

const CustomersContainer = (props) => {
  console.log('cusProps', props)
  const initialFilter = {
    statusId: [3],
    name: null,
    mobile: null,
    offset: 0,
    limit: u.limit
  }
  const [filter, setFilter] = useState(initialFilter)

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    statusId: filter.statusId,
    name: filter.name ? `%${filter.name}%` : null,
    mobile: filter.mobile ? `%${filter.mobile}%` : null
  }

  const { loading, error, data } = useQuery(CUSTOMERS_QUERY, {
    variables: variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('CustomersContainer error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const customer_user = get(_data, 'customer_user', null)
  const customer_status = get(_data, 'customer_status', [])
  const customer_aggregate = get(_data, 'customer_user_aggregate', null)

  const customer_status_list = customer_status && customer_status.filter((data) => data.id !== 8)

  const record_count = get(customer_aggregate, 'aggregate.count', 0)

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
            customers={customer_user}
            customer_status_list={customer_status_list}
            record_count={record_count}
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
