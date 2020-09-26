import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import Customers from '../customers'
import get from 'lodash/get'
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
      id
      cardcode
      customer_users {
        id
        name
      }
      name
      mobile
      customer_type_id
      customer_type{
        id
        name
      }
      created_at
      pan
      advance_percentage_id
      customer_advance_percentage{
        name
        id
      }
      system_mamul
      status {
        id
        name
      }
      customer_files(where:{deleted_at: {_is_null: true}}) {
        type
        file_path
        folder
        id
        created_at
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
    customer_status(order_by: { id: asc }, where:{name:{_neq:"Lead"}}) {
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
  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer', null)
  const customer_status = get(_data, 'customer_status', [])
  const customer_aggregate = get(_data, 'customer_aggregate', 0)

  const customer_status_list = customer_status && customer_status.filter((data) => data.id !== 8)

  const record_count = get(customer_aggregate, 'aggregate.count', 0)

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
