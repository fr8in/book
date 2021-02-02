import { Row, Col, Card, Tabs, DatePicker, Popover } from 'antd'
import Trucks from '../trucks'
import { useState } from 'react'
import u from '../../../lib/util'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { gql, useQuery, useSubscription } from '@apollo/client'
import moment from 'moment'
import Insurance from '../Insurance'

const { RangePicker } = DatePicker

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
    region: null,
    no_date: []
  }
  const [filter, setFilter] = useState(initialFilter)
  const [checked,setChecked] = useState([])
  const [tabIndex, setTabIndex] = useState('0')
  const [dates, setDates] = useState([])
  const startDate = isEmpty(dates) ? null : moment(dates[0]).format('DD-MMM-YY')
  const endDate = isEmpty(dates) ? null : moment(dates[1]).format('DD-MMM-YY')

  const perviousDate = u.getPervious4thDate()
  const futureDate = u.getfuture3rdDate()
  const daysBefore = moment(perviousDate).format('DD-MMM-YY')
  const daysAfter = moment(futureDate).format('DD-MMM-YY')

  const where = {
    truck_status: { id: { _eq: filter.truck_statusId ? filter.truck_statusId : null } },
    partner: { city: { connected_city: { branch: { region: { name: { _in: !isEmpty(filter.region) ? filter.region : null } } } } } },
    truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null },
      ...!isEmpty(filter.no_date) ? { insurance_expiry_at: { _is_null: true } }:
      {_and: [{ insurance_expiry_at: { _gte: startDate ? startDate : daysBefore } },
      { insurance_expiry_at: { _lte: endDate ? endDate : daysAfter } }
      ]}
    
  }

  const { loading: truck_loading, error: truck_error, data: truck_data } = useSubscription(
    TRUCKS_SUBSCRIPTION,
    {
      variables: {
        offset: filter.offset,
        limit: u.limit,
        where: where
      }
    }
  )


  const { loading, error, data } = useQuery(TRUCKS_QUERY, {
    variables: {
      where: where
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
    setFilter({ ...filter, region: value })
  }
  const onNoDateFilter = (value) => {
    setFilter({ ...filter, no_date: value })
  }

  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30
    return ((tooEarly || tooLate))
  }
  let no_date_checked = checked === undefined ? [] : checked
  
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Row className='navAlign'>
        <Col sm={24}>
          <Tabs
            tabBarExtraContent={
              tabIndex === '0' &&
              no_date_checked.length > 0 ? 
              <Popover 
              content='Please uncheck No Date filter of Insurance Expiry Date'
              >
              <RangePicker
              size='small'
              format='DD-MMM-YYYY'
              disabled
              defaultValue={[moment(perviousDate,'DD-MMM-YY'),moment(futureDate,'DD-MMM-YY')]}
              disabledDate={(current) => disabledDate(current)}
              onCalendarChange={(value) => {
                setDates(value)
              }}
            /> </Popover>:
              <RangePicker
                size='small'
                format='DD-MMM-YYYY'
                defaultValue={[moment(perviousDate,'DD-MMM-YY'),moment(futureDate,'DD-MMM-YY')]}
                disabledDate={(current) => disabledDate(current)}
                onCalendarChange={(value) => {
                  setDates(value)
                }}
              />
            }
            onChange={(e) => setTabIndex(e)}
          >
            <Tabs.TabPane tab="Trucks" key="0">
              <Trucks
                trucks={truck}
                truck_status_list={truck_status_list}
                status={truck_status}
                loading={truck_loading}
                filter={filter}
                onRegionFilter={onRegionFilter}
                onFilter={onFilter}
                setChecked={setChecked}
                onNoDateFilter={onNoDateFilter}
                onPageChange={onPageChange}
                onTruckNoSearch={onTruckNoSearch}
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
