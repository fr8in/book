import { useState } from 'react'
import { Card, Tabs, Space, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import { useQuery } from '@apollo/client'
import { TRIPS_QUERY } from './query/tripsQuery'
import useShowHide from '../../../hooks/useShowHide'
import Trips from '../trips'
import TitleWithCount from '../../common/titleWithCount'
import DeliveredContainer from '../containers/deliveredContainer'
import PodVerifiedContainer from '../containers/podVerifiedContainer'
import InvoicedContainer from '../containers/invoicedContainer'

const { TabPane } = Tabs

const TripsContainer = () => {
  const [tabKey, setTabKey] = useState('1')

  const initial = { pod_receipt: false, pod_dispatch: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const initialFilter = {
    offset: 0,
    limit: 10,
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    id: null,
    trip_statusName: ['Delivered', 'Approval Pending', 'POD Verified', 'Invoiced', 'Paid', 'Received', 'Closed']
  }
  const [filter, setFilter] = useState(initialFilter)

  const aggrigation = {
    all_trip: { _and: [{ trip_status: { name: { _in: initialFilter.trip_statusName } } }] },
    delivered_trip: { _and: [{ trip_status: { name: { _in: ['Delivered'] } } }, { trip_pod_status: { name: { _neq: 'POD Verified' } } }] },
    pod_verified_trip: { _and: [{ trip_status: { name: { _in: ['Delivered'] } } }, { trip_pod_status: { name: { _eq: 'POD Verified' } } }] },
    invoiced_trip: { _and: [{ trip_status: { name: { _in: ['Invoiced', 'Paid', 'Received', 'Closed'] } } }, { trip_pod_status: { name: { _neq: 'POD Dispatched' } } }] }
  }

  const where = {
    _and: [{ trip_status: { name: { _in: filter.trip_statusName && filter.trip_statusName.length > 0 ? filter.trip_statusName : initialFilter.trip_statusName } } }],
    id: { _in: filter.id ? filter.id : null },
    partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } },
    customer: { name: { _ilike: filter.customername ? `%${filter.customername}%` : null } },
    source: { name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
    destination: { name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
    truck: { truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null } }
  }

  const variables = {
    all_trip: aggrigation.all_trip,
    delivered_trip: aggrigation.delivered_trip,
    pod_verified_trip: aggrigation.pod_verified_trip,
    invoiced_trip: aggrigation.invoiced_trip,
    offset: filter.offset,
    limit: filter.limit,
    where: where,
    trip_statusName: initialFilter.trip_statusName
  }

  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
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
  const record_count = get(_data, 'rows.aggregate.count', 0)
  // for filter options
  const trip_status = get(_data, 'trip_status', [])

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
  }
  const onPartnerNameSearch = (value) => {
    setFilter({ ...filter, partnername: value, offset: 0 })
  }
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value, offset: 0 })
  }
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value, offset: 0 })
  }
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value, offset: 0 })
  }
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value, offset: 0 })
  }
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusName: value, offset: 0 })
  }
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value, offset: 0 })
  }
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
          <Trips
            trips={trip}
            loading={loading}
            record_count={record_count}
            filter={filter}
            onPageChange={onPageChange}
            onPartnerNameSearch={onPartnerNameSearch}
            onCustomerNameSearch={onCustomerNameSearch}
            onSourceNameSearch={onSourceNameSearch}
            onDestinationNameSearch={onDestinationNameSearch}
            onTruckNoSearch={onTruckNoSearch}
            onTripIdSearch={onTripIdSearch}
            trip_status_list={trip_status}
            onFilter={onFilter}
          />
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
