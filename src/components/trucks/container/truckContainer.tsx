import { Row, Col, Card } from 'antd'
import Trucks from '../trucks'
import { useState } from 'react'
import u from '../../../lib/util'

import { gql, useQuery } from '@apollo/client'

const TRUCKS_QUERY = gql`
  query trucks(
    $offset: Int!
    $limit: Int!
    $trip_status_id: [Int!]
    $truck_statusId: [Int!]
    $name: String
    $truckno: String
  ) {
    truck(
      offset: $offset
      limit: $limit
      where: {
        truck_status: { id: { _in: $truck_statusId } }
        partner: { name: { _ilike: $name } }
        truck_no: { _ilike: $truckno }
      }
    ) {
      id
      truck_no
      available_at
      truck_type_id
      truck_status_id
      truck_type {
        name
      }
      city {
       name
      }
      truck_status {
        id
        name
      }
      partner {
        id
        name
        partner_users(limit: 1, where: { is_admin: { _eq: true } }) {
          mobile
        }
        cardcode
      }
      trips(where: { trip_status_id: { _in: $trip_status_id } }) {
        id
        source {
          name
        }
        destination {
          name
        }
      }
    }
    truck_status(order_by: { id: asc }) {
      id
      name
    }
    truck_aggregate(where: { truck_status: { id: { _in: $truck_statusId } } }) {
      aggregate {
        count
      }
    }
  }
`

const TruckContainer = () => {
  const initialFilter = {
    truck_statusId: [1],
    name: null,
    truckno: null,
    offset: 0,
    limit: u.limit
  }
  const [filter, setFilter] = useState(initialFilter)

  const trucksQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    truck_statusId: filter.truck_statusId,
    trip_status_id: [2, 3, 4, 5, 6, 8],
    truckno: filter.truckno ? `%${filter.truckno}%` : null,
    name: filter.name ? `%${filter.name}%` : null
  }

  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    variables: trucksQueryVars,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('TrucksContainer error', error)
  var truck = []
  var truck_status = []

  var truck_aggregate = 0

  if (!loading) {
    truck = data.truck
    truck_status = data.truck_status

    truck_aggregate = data && data.truck_aggregate
  }
  const truck_status_list = truck_status.filter((data) => data.id !== 10)

  const record_count =
    truck_aggregate.aggregate && truck_aggregate.aggregate.count

  console.log('record_count', record_count)
  const onFilter = (value) => {
    setFilter({ ...filter, truck_statusId: value })
  }

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }

  const onNameSearch = (value) => {
    setFilter({ ...filter, name: value })
  }

  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value })
  }

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Row>
        <Col sm={24}>
          <Card size='small' className='card-body-0'>
            <Trucks
              trucks={truck}
              truck_status_list={truck_status_list}
              status={truck_status}
              loading={loading}
              filter={filter}
              onFilter={onFilter}
              onPageChange={onPageChange}
              onNameSearch={onNameSearch}
              onTruckNoSearch={onTruckNoSearch}
              record_count={record_count}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
export default TruckContainer
