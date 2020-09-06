import { useState } from 'react'
import { Card, Tabs, Space, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'
import useShowHide from '../../../hooks/useShowHide'
import TitleWithCount from '../../common/titleWithCount'
import DeliveredContainer from '../containers/deliveredContainer'
import PodVerifiedContainer from '../containers/podVerifiedContainer'
import InvoicedContainer from '../containers/invoicedContainer'
import AllTripsContainer from './allTripsContainer'

const TRIPS_COUNT_QUERY = gql`
query trips($all_trip: trip_bool_exp, $delivered_trip: trip_bool_exp, $pod_verified_trip: trip_bool_exp, $invoiced_trip: trip_bool_exp) {
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
  pod_verified: trip_aggregate(where: $pod_verified_trip) {
    aggregate {
      count
    }
  }
  invoiced: trip_aggregate(where: $invoiced_trip) {
    aggregate {
      count
    }
  }
}
`

const { TabPane } = Tabs

const TripsContainer = () => {
  const [tabKey, setTabKey] = useState('1')

  const initial = { pod_receipt: false, pod_dispatch: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const aggrigation = {
    all_trip: { _and: [{ trip_status: { name: { _in: ['Delivered', 'Invoiced', 'Paid', 'Received', 'Closed'] } } }] },
    delivered_trip: { _and: [{ trip_status: { name: { _in: ['Delivered'] } } }/* , { trip_pod_status: { name: { _neq: 'POD Verified' } } } */] },
    pod_verified_trip: { _and: [{ trip_status: { name: { _in: ['Delivered'] } } }/* , { trip_pod_status: { name: { _eq: 'POD Verified' } } } */] },
    invoiced_trip: { _and: [{ trip_status: { name: { _in: ['Invoiced', 'Paid', 'Received', 'Closed'] } } }/* , { trip_pod_status: { name: { _neq: 'POD Dispatched' } } } */] }
  }

  const variables = {
    all_trip: aggrigation.all_trip,
    delivered_trip: aggrigation.delivered_trip,
    pod_verified_trip: aggrigation.pod_verified_trip,
    invoiced_trip: aggrigation.invoiced_trip
  }

  const { loading, error, data } = useQuery(
    TRIPS_COUNT_QUERY,
    {
      variables: variables,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('TripsContainer error', error)
  var _data = {}
  if (!loading) {
    _data = data
  }
  // all trip data
  const trip = get(_data, 'trip', [])
  // trip count for tab
  const all_count = get(_data, 'trip_count.aggregate.count', 0)
  const delivered_count = get(_data, 'delivered.aggregate.count', 0)
  const pod_count = get(_data, 'pod_verified.aggregate.count', 0)
  const invoiced_count = get(_data, 'invoiced.aggregate.count', 0)
  // for pagination
  const onTabChange = (key) => {
    setTabKey(key)
  }

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        defaultActiveKey='1'
        onChange={onTabChange}
        tabBarExtraContent={
          <span>
            {tabKey === '2' &&
              <Space>
                <Button shape='circle' icon={<DownloadOutlined />} />
                <Button type='primary' onClick={() => onShow('pod_receipt')}>POD Receipt</Button>
              </Space>}
            {tabKey === '4' &&
              <Space>
                <Button type='primary' onClick={() => onShow('pod_dispatch')}>POD Dispatch</Button>
              </Space>}
          </span>
        }
      >
        <TabPane tab={<TitleWithCount name='Trips' value={all_count} />} key='1'>
          <AllTripsContainer />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Delivered' value={delivered_count} />} key='2'>
          <DeliveredContainer visible_receipt={visible.pod_receipt} onHide={onHide} />
        </TabPane>
        <TabPane tab={<TitleWithCount name='POD Verified' value={pod_count} />} key='3'>
          <PodVerifiedContainer />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Invoiced' value={invoiced_count} />} key='4'>
          <InvoicedContainer visible_dispatch={visible.pod_dispatch} onHide={onHide} />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default TripsContainer
