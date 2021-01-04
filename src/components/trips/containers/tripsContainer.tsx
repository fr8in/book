import { useState } from 'react'
import { Card, Tabs, Space, Button, Badge } from 'antd'
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
query trips_count($all_trip: trip_bool_exp, $delivered_trip: trip_bool_exp, $pod_verified_trip: trip_bool_exp, $invoiced_trip: trip_bool_exp) {
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
  const initialvalue = {
    delivered_partnername: null,
    delivered_truckno: null,
    delivered_customername: null,
    pod_verified_partnername: null,
    pod_verified_truckno: null,
    pod_verified_customername: null,
    invoiced_partnername: null,
    invoiced_truckno: null,
    invoiced_customername: null,
    pod_receipt_count: 0,
    pod_dispatch_count: 0,
    invoiced_paymentmanagername: null
  }
  const [countFilter, setCountFilter] = useState(initialvalue)
  const [tabKey, setTabKey] = useState('1')

  const initial = { pod_receipt: false, pod_dispatch: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const aggrigation = {
    all_trip: { _and: [{ trip_status: { name: { _in: ['Delivered', 'Invoiced', 'Paid', 'Recieved', 'Closed'] } } }] },
    delivered_trip: { _and: [{ trip_status: { name: { _in: ['Delivered'] } }, pod_verified_at: { _is_null: true } }], customer: { name: { _ilike: countFilter.delivered_customername ? `%${countFilter.delivered_customername}%` : null } }, partner: { name: { _ilike: countFilter.delivered_partnername ? `%${countFilter.delivered_partnername}%` : null } }, truck: { truck_no: { _ilike: countFilter.delivered_truckno ? `%${countFilter.delivered_truckno}%` : null } } },
    pod_verified_trip: { _and: [{ trip_status: { name: { _in: ['Delivered'] } }, pod_verified_at: { _is_null: false } }], customer: { name: { _ilike: countFilter.pod_verified_customername ? `%${countFilter.pod_verified_customername}%` : null } }, partner: { name: { _ilike: countFilter.pod_verified_partnername ? `%${countFilter.pod_verified_partnername}%` : null } }, truck: { truck_no: { _ilike: countFilter.pod_verified_truckno ? `%${countFilter.pod_verified_truckno}%` : null } } },
    invoiced_trip: { _and: [{ trip_status: { name: { _in: ['Invoiced', 'Paid', 'Recieved', 'Closed'] } }, pod_dispatched_at: { _is_null: true } }], customer: { name: { _ilike: countFilter.invoiced_customername ? `%${countFilter.invoiced_customername}%` : null }, payment_manager: { name: { _ilike: countFilter.invoiced_paymentmanagername ? `%${countFilter.invoiced_paymentmanagername}%` : null } } } },
    partner: { name: { _ilike: countFilter.invoiced_partnername ? `%${countFilter.invoiced_partnername}%` : null } },
    truck: { truck_no: { _ilike: countFilter.invoiced_truckno ? `%${countFilter.invoiced_truckno}%` : null } }
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

  let _data = {}
  if (!loading) {
    _data = data
  }
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
                <Button type='primary' onClick={() => onShow('pod_receipt')}>POD Receipt &nbsp;<Badge count={countFilter.pod_receipt_count} size='small' /> </Button>
              </Space>}
            {tabKey === '4' &&
              <Space>
                <Button type='primary' onClick={() => onShow('pod_dispatch')}>POD Dispatch &nbsp;<Badge count={countFilter.pod_dispatch_count} size='small' /></Button>
              </Space>}
          </span>
        }
      >
        <TabPane tab={<TitleWithCount name='Trips' value={all_count} />} key='1'>
          <AllTripsContainer />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Delivered' value={delivered_count} />} key='2'>
          <DeliveredContainer visible_receipt={visible.pod_receipt} onHide={onHide} setCountFilter={setCountFilter} countFilter={countFilter} />
        </TabPane>
        <TabPane tab={<TitleWithCount name='POD Verified' value={pod_count} />} key='3'>
          <PodVerifiedContainer PodVerified_countFilter={countFilter} PodVerified_setCountFilter={setCountFilter} />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Invoiced' value={invoiced_count} />} key='4'>
          <InvoicedContainer visible_dispatch={visible.pod_dispatch} onHide={onHide} invoiced_countFilter={countFilter} invoiced_setCountFilter={setCountFilter} />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default TripsContainer
