import { Row, Col, Card } from 'antd'
import Trucks from '../trucks'
import { useState } from 'react'
import u from '../../../lib/util'
import get from 'lodash/get'

import { gql, useQuery, useSubscription } from '@apollo/client'
import moment from 'moment'

const TRUCKS_SUBSCRIPTION = gql`
subscription trucks_list(
  $offset: Int!
  $limit: Int!
  $truck_statusId: Int!
  $name: String
  $truckno: String
  $insurance_start: timestamp
  $insurance_end: timestamp
  )
  {
    truck(
      offset: $offset
      limit: $limit
      where: {
        truck_status: { id: { _eq: $truck_statusId } }
        partner: { name: { _ilike: $name } }
        truck_no: { _ilike: $truckno }
        _and:[ {insurance_expiry_at: {_gte:$insurance_start}},
        {insurance_expiry_at: {_lte:$insurance_end}}
        ]
      }
    ) {
      id
      truck_no
      available_at
      insurance_expiry_at
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
        partner_status{
          id
          name
        }
      }
      trips(limit: 1, order_by:{id:desc}, where:{trip_status_id:{_neq:7}}) {
        id
        source {
          name
        }
        destination {
          name
        }
     }
  }
  }
`

const TRUCKS_QUERY = gql`
  query trucks(
    
    $truck_statusId: [Int!]
    $name: String
    $truckno: String
  ) {
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
    truck_statusId: 5,
    name: null,
    truckno: null,
    offset: 0,
    limit: u.limit,
    insurance_end:null,
    insurance_start:null
  }
  const [filter, setFilter] = useState(initialFilter)

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    truck_statusId: filter.truck_statusId,
    truckno: filter.truckno ? `%${filter.truckno}%` : null,
    name: filter.name ? `%${filter.name}%` : null,
    insurance_end:filter.insurance_end,
    insurance_start:filter.insurance_start
  }
  const { loading: s_loading, error: s_error, data: s_data } = useSubscription(
    TRUCKS_SUBSCRIPTION,
    {
      variables: variables
    }
  )

  const trucksQueryVars = {
    truck_statusId: filter.truck_statusId,
    truckno: filter.truckno ? `%${filter.truckno}%` : null,
    name: filter.name ? `%${filter.name}%` : null
  }

  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    variables: trucksQueryVars,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  let _sdata = {}
  if (!s_loading) {
    _sdata = s_data
  }

  const truck = get(_sdata, 'truck', [])

  let _data = {}
  if (!loading) {
    _data = data
  }

  const truck_status = get(_data, 'truck_status', [])
  const truck_aggregate = get(_data, 'truck_aggregate', null)
  const truck_status_list = truck_status.filter((data) => data.id !== 10)

  const record_count = get(truck_aggregate, 'aggregate.count', 0)

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
  const insurance_filter =
  {
    'All':{insurance_start:null, insurance_end:null},
    '15':{insurance_start:moment().add(-1,'days'),insurance_end:moment().add(15,'days')},
    '30':{insurance_start:moment().add(-1,'days'),insurance_end:moment().add(30,'days')},
  }

  const onInsuranceFilter = (value) => {
    setFilter({ ...filter, ...insurance_filter[value] })
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
              loading={s_loading}
              filter={filter}
              onFilter={onFilter}
              onPageChange={onPageChange}
              onNameSearch={onNameSearch}
              onTruckNoSearch={onTruckNoSearch}
              onInsuranceFilter={onInsuranceFilter}
              record_count={record_count}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
export default TruckContainer
