import { useState } from 'react'
import { Card, Tabs, Space, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import Trips from '../trips'
import TitleWithCount from '../../common/titleWithCount'
import PartnerPodReceipt from '../../partners/partnerPodReceipt'
import useShowHide from '../../../hooks/useShowHide'
import CustomerPodReceipt from '../../customers/customerPodReceipt'

import { gql, useQuery } from '@apollo/client'

const TRIPS_QUERY = gql`
  query trips($offset: Int!, $limit: Int!, $where: trip_bool_exp, $all_trip: trip_bool_exp, $delivered_trip: trip_bool_exp, $pod_verified_trip: trip_bool_exp, $invoiced_trip: trip_bool_exp){
    trip_count: trip_aggregate(where: $all_trip) {
      aggregate {
        count
      }
    }
    delivered: trip_aggregate(where: $delivered_trip) {
      aggregate {
        count
      }
    }
    pod_verified: trip_aggregate(where:$pod_verified_trip ) {
      aggregate {
        count
      }
    }
    invoiced: trip_aggregate(where: $invoiced_trip) {
      aggregate {
        count
      }
    }
    trip(offset: $offset, limit: $limit, where: $where ) {
      id
      order_date
      customer {
        name
        cardcode
      } 
      partner {
        name
        cardcode
      }
      truck {
        truck_no
      }
      source {
        name
      }
      destination {
        name
      }
      trip_status{
        value
      }
      km    
      tat
      trip_comments(limit:1, order_by: {created_at: desc}) {
        description
        created_by
        created_at
      }
      trip_prices(limit:1, where:{deleted_at:{_is_null:true}})
      {
        id
        customer_price
        partner_price
      }
    }
  }  
  `
const { TabPane } = Tabs

const TripsContainer = () => {
  const trip_where = {
    tabKey: '1',
    offset: 0,
    limit: 10,
    all_trip: null,
    where: null,
    delivered_trip: { _and: [{ trip_status: { value: { _eq: 'Delivered' } } }, { trip_pod_status: { value: { _neq: 'POD Verified' } } }] },
    pod_verified_trip: { _and: [{ trip_status: { value: { _eq: 'Delivered' } } }, { trip_pod_status: { value: { _eq: 'POD Verified' } } }] },
    invoiced_trip: { _and: [{ trip_status: { value: { _eq: 'Invoiced' } } }, { trip_pod_status: { value: { _neq: 'POD Dispatched' } } }] }
  }
  const [vars, setVars] = useState(trip_where)

  const variables = {
    offset: vars.offset,
    limit: vars.limit,
    where: vars.where,
    all_trip: trip_where.all_trip,
    delivered_trip: trip_where.delivered_trip,
    pod_verified_trip: trip_where.pod_verified_trip,
    invoiced_trip: trip_where.invoiced_trip
  }
  const initial = { podModal: false, CustomerPod: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
    {
      variables: variables,
      notifyOnNetworkStatusChange: true
    }
  )

  const onTabChange = (key) => {
    if (key === '1') {
      setVars({ ...vars, where: null, tabKey: key })
    }
    if (key === '2') {
      setVars({ ...vars, where: trip_where.delivered_trip, tabKey: key })
    }
    if (key === '3') {
      setVars({ ...vars, where: trip_where.pod_verified_trip, tabKey: key })
    }
    if (key === '4') {
      setVars({ ...vars, where: trip_where.invoiced_trip, tabKey: key })
    }
  }

  console.log('TripsContainer error', error)
  var trip = []
  var trip_count = 0
  var delivered = 0
  var pod_verified = 0
  var invoiced = 0

  if (!loading) {
    trip = data.trip
    trip_count = data.trip_count
    delivered = data.delivered
    pod_verified = data.pod_verified
    invoiced = data.invoiced
  }

  const all_count = trip_count && trip_count.aggregate && trip_count.aggregate.count
  const delivered_count = delivered && delivered.aggregate && delivered.aggregate.count
  const pod_count = pod_verified && pod_verified.aggregate && pod_verified.aggregate.count
  const invoiced_count = invoiced && invoiced.aggregate && invoiced.aggregate.count

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        defaultActiveKey='1'
        onChange={onTabChange}
        tabBarExtraContent={
          <span>
            {vars.tabKey === '2' &&
              <Space>
                <Button shape='circle' icon={<DownloadOutlined />} />
                <Button type='primary' onClick={() => onShow('podModal')}>POD Receipt</Button>
              </Space>}
            {vars.tabKey === '4' &&
              <Space>
                <Button type='primary' onClick={() => onShow('CustomerPod')}>POD Dispatch</Button>
              </Space>}
          </span>
        }
      >
        <TabPane tab={<TitleWithCount name='Trips' value={all_count} />} key='1'>
          <Trips trips={trip} loading={loading} tripsTable />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Delivered' value={delivered_count} />} key='2'>
          <Trips trips={trip} loading={loading} delivered />
        </TabPane>
        <TabPane tab={<TitleWithCount name='POD Verified' value={pod_count} />} key='3'>
          <Trips trips={trip} loading={loading} delivered />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Invoiced' value={invoiced_count} />} key='4'>
          <Trips trips={trip} loading={loading} delivered />
        </TabPane>
      </Tabs>
      {visible.podModal && (
        <PartnerPodReceipt
          visible={visible.podModal}
          onHide={onHide}
        />
      )}
      {visible.CustomerPod && (
        <CustomerPodReceipt
          visible={visible.CustomerPod}
          onHide={onHide}
        />
      )}
    </Card>
  )
}

export default TripsContainer
