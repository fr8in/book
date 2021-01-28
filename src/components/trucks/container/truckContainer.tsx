import { Row, Col, Card, Tabs } from 'antd'
import Trucks from '../trucks'
import { useState } from 'react'
import u from '../../../lib/util'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { gql, useQuery, useSubscription } from '@apollo/client'
import moment from 'moment'
import Insurance from '../Insurance'

const TRUCKS_SUBSCRIPTION = gql`
subscription trucks_list($offset: Int!, $limit: Int!,$where:truck_bool_exp) {
  truck(offset: $offset, limit: $limit, where: $where) {
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
    insurance {
      id
    }
    partner {
      id
      name
      partner_users(limit: 1, where: {is_admin: {_eq: true}}) {
        mobile
      }
      cardcode
      partner_status {
        id
        name
      }
      city {
        branch {
          region {
            name
          }
        }
      }
    }
    trips(limit: 1, order_by: {id: desc}, where: {trip_status_id: {_neq: 7}}) {
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
query trucks($where:truck_bool_exp){
  truck_status(order_by: {id: asc}) {
    id
    name
  }
  truck_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
`

const TruckContainer = () => {
  const initialFilter = {
    truck_statusId: 5,
    truckno: null,
    offset: 0,
    insurance_end: null,
    insurance_start: null,
    region: null
  }
  const [filter, setFilter] = useState(initialFilter)

  const where = {
  truck_status: {id: {_eq: filter.truck_statusId ? filter.truck_statusId : null}},
  partner: {city: {connected_city: {branch: {region: {name: {_in: !isEmpty(filter.region) ?  filter.region : null }}}}}},
   truck_no: {_ilike: filter.truckno ? `%${filter.truckno}%` : null},
   _and: [{insurance_expiry_at: {_gte: filter.insurance_start ? filter.insurance_start : null}},
     {insurance_expiry_at: {_lte: filter.insurance_end ? filter.insurance_end : null}}]
  }
  const { loading: truck_loading, error: truck_error, data: truck_data } = useSubscription(
    TRUCKS_SUBSCRIPTION,
    {
      variables: {
        offset:filter.offset,
        limit:u.limit,
        where:where
      }
    }
  )

  
  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    variables: {
      where:where
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  let _sdata = {}
  if (!truck_loading) {
    _sdata = truck_data
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


  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value })
  }

const onRegionFilter = (value) => {
  setFilter({...filter, region:value})
}

  const insurance_filter =
  {
    'All': { insurance_start: null, insurance_end: null },
    '15': { insurance_start: moment().add(-1, 'days'), insurance_end: moment().add(15, 'days') },
    '30': { insurance_start: moment().add(-1, 'days'), insurance_end: moment().add(30, 'days') },
  }

  const onInsuranceFilter = (value) => {
    setFilter({ ...filter, ...insurance_filter[value] })
  }

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Row>
        <Col sm={24}>
          <Tabs defaultActiveKey="0">
            <Tabs.TabPane tab="Trucks" key="0">
              <Trucks
                trucks={truck}
                truck_status_list={truck_status_list}
                status={truck_status}
                loading={truck_loading}
                filter={filter}
                onRegionFilter={onRegionFilter}
                onFilter={onFilter}
                onPageChange={onPageChange}
                onTruckNoSearch={onTruckNoSearch}
                onInsuranceFilter={onInsuranceFilter}
                record_count={record_count}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Insurance" key="1">
              <Insurance />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  )
}
export default TruckContainer
