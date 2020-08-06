import { useState } from 'react'
import { Card, Tabs, Space, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import Trips from '../trips'
import TitleWithCount from '../../common/titleWithCount'
import PartnerPodReceipt from '../../partners/partnerPodReceipt'
import useShowHide from '../../../hooks/useShowHide'
import CustomerPodReceipt from '../../customers/customerPodReceipt'
import {useQuery } from '@apollo/client'
import {TRIPS_QUERY} from './query/tripsQuery'
import  DeliveredContainer  from '../containers/deliveredContainer'
import PodVerifiedContainer from '../containers/podVerifiedContainer'
import InvoicedContainer from '../containers/invoicedContainer'

const { TabPane } = Tabs

const TripsContainer = () => {
  const initialFilter = {
    offset: 0,
    limit: 3,  
    name:null,
    customername:null,
    sourcename:null,
    destinationname:null,
    truckno: null,
    trip_statusId: [9,10,11,12,13,14,15],
    id:null
  };
  const [filter, setFilter] = useState(initialFilter);

   const trip_where = {
    tabKey: '1',
    all_trip:{_and: [{trip_status:{id: {_nin: [1,2,3,4,5,6,7,8]}}}]},
    where: null,
    delivered_trip: { _and: [{ trip_status: { name: { _eq: 'Delivered' } } }, { trip_pod_status: { name: { _neq: 'POD Verified' } } }] },
    pod_verified_trip: { _and: [{ trip_status: { name: { _eq: 'Delivered' } } }, { trip_pod_status: { name: { _eq: 'POD Verified' } } }] },
    invoiced_trip: { _and: [{ trip_status: { name: { _eq: 'Invoiced' } } }, { trip_pod_status: { name: { _neq: 'POD Dispatched' } } }] }
  }
   const [vars, setVars] = useState(trip_where)
  const where ={
    partner: {
       name: { _ilike: filter.name ? `%${filter.name}%` : null } 
      },
  customer: { 
    name: { _ilike: filter.customername ? `%${filter.customername}%` : null } },
  source: { 
    name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
  destination: { 
    name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
   truck: {
     truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null }} ,
   trip_status: { 
     id: { _in: filter.trip_statusId } },
   id:{_in:filter.id }, }

  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    where: where,
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
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true
    }
  )

  const onTabChange = (key) => {
     setFilter(initialFilter)
    if (key === '1') {
      setVars({ ...vars, where: trip_where.all_trip,tabKey: key})
    }
    if (key === '2') {
      setVars({ ...vars, where: trip_where.delivered_trip,tabKey: key })
    }
    if (key === '3') {
      setVars({ ...vars, where: trip_where.pod_verified_trip ,tabKey: key})
    }
    if (key === '4') {
      setVars({ ...vars, where: trip_where.invoiced_trip,tabKey: key})
    }
    }

  console.log('TripsContainer error', error)
  console.log('data',data)
  var trip = []
  var trip_count = 0
  var delivered = 0
  var pod_verified = 0
  var invoiced = 0
  var trip_count = 0;
  var trip_status = [];

  if (!loading) {
    trip = data && data.trip
    trip_count = data && data.trip_count
    delivered = data && data.delivered
    pod_verified = data && data.pod_verified
    invoiced = data && data.invoiced
    trip_count = data && data && data.trip_count;
    trip_status = data && data.trip_status;
  }

  const all_count = trip_count && trip_count.aggregate && trip_count.aggregate.count
  const delivered_count = delivered && delivered.aggregate && delivered.aggregate.count
  const pod_count = pod_verified && pod_verified.aggregate && pod_verified.aggregate.count
  const invoiced_count = invoiced && invoiced.aggregate && invoiced.aggregate.count

  const trip_status_list = trip_status.filter((data) => data.id !== 16);

  const record_count =
  trip_count.aggregate && trip_count.aggregate.count;
const total_page = Math.ceil(record_count / filter.limit);
console.log("record_count", record_count);

  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value });
  };
  const onPartnerNameSearch = (value) => {
    setFilter({ ...filter, name: value });
  };
  const onCustomerNameSearch = (value) => {
    setFilter({ ...filter, customername: value });
  };
  const onSourceNameSearch = (value) => {
    setFilter({ ...filter, sourcename: value });
  };
  const onDestinationNameSearch = (value) => {
    setFilter({ ...filter, destinationname: value });
  };
  const onTruckNoSearch = (value) => {
    setFilter({ ...filter, truckno: value });
  };
  const onFilter = (name) => {
    setFilter({ ...filter, trip_statusId: name });
  };
  const onTripIdSearch = (value) => {
    setFilter({ ...filter, id: value });
  };
 
  
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
          <Trips trips={trip} loading={loading} 
          record_count={record_count}
          total_page={total_page}
          filter={filter}
          onPageChange={onPageChange}
          onPartnerNameSearch={onPartnerNameSearch}
          onCustomerNameSearch={onCustomerNameSearch}
          onSourceNameSearch={onSourceNameSearch}
          onDestinationNameSearch={onDestinationNameSearch}
          onTruckNoSearch={onTruckNoSearch}
          onTripIdSearch={onTripIdSearch}
          trip_status_list={trip_status_list}
          onFilter={onFilter}
          tripsTable />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Delivered'  value={delivered_count} />} key='2'>
          <DeliveredContainer  />
        </TabPane>
        <TabPane tab={<TitleWithCount name='POD Verified'  value={pod_count}/>} key='3'>
          <PodVerifiedContainer  />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Invoiced'  value={invoiced_count}/>} key='4'>
          <InvoicedContainer />
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
