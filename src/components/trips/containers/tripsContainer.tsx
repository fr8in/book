import { useState } from 'react'
import { Card, Tabs, Space, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import { useQuery } from '@apollo/client'
import { TRIPS_QUERY } from './query/tripsQuery'
import useShowHide from '../../../hooks/useShowHide'
import Trips from '../trips'
import TitleWithCount from '../../common/titleWithCount'
import PartnerPodReceipt from '../../partners/partnerPodReceipt'
import CustomerPodReceipt from '../../customers/customerPodReceipt'
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
    limit: 1,
    partnername: null,
    customername: null,
    sourcename: null,
    destinationname: null,
    truckno: null,
    id: null,
    trip_statusId: [9, 10, 11, 12, 13, 14, 15]
  }
  const [filter, setFilter] = useState(initialFilter)

  const aggrigation = {
    all_trip: { _and: [{ trip_status: { id: { _in: [9, 10, 11, 12, 13, 14, 15] } } }] },
    delivered_trip: { _and: [{ trip_status: { id: { _in: [9, 10] } } }, { trip_pod_status: { name: { _neq: 'POD Verified' } } }] },
    pod_verified_trip: { _and: [{ trip_status: { id: { _in: [10, 11] } } }, { trip_pod_status: { name: { _eq: 'POD Verified' } } }] },
    invoiced_trip: { _and: [{ trip_status: { id: { _in: [12, 13, 14, 15] } } }, { trip_pod_status: { name: { _neq: 'POD Dispatched' } } }] }
  }

  const where = {
    _and: [{ trip_status: { id: { _in: filter.trip_statusId } } }],
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
    trip_statusId: initialFilter.trip_statusId
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
    setFilter({ ...filter, partnername: value })
  }
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value })
  }
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value })
  }
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value })
  }
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value })
  }
  const onFilter = (value) => {
    setFilter({ ...filter, trip_statusId: value })
  }
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value })
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
          <DeliveredContainer />
        </TabPane>
        <TabPane tab={<TitleWithCount name='POD Verified' value={pod_count} />} key='3'>
          <PodVerifiedContainer />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Invoiced' value={invoiced_count} />} key='4'>
          <InvoicedContainer />
        </TabPane>
      </Tabs>
      {visible.pod_receipt && (
        <PartnerPodReceipt
          visible={visible.pod_receipt}
          onHide={onHide}
        />
      )}
      {visible.pod_dispatch && (
        <CustomerPodReceipt
          visible={visible.pod_dispatch}
          onHide={onHide}
        />
      )}
    </Card>
  )
}

export default TripsContainer
