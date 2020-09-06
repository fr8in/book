import { Modal, Table } from 'antd'
import onholdData from '../../../mock/trip/onholdTrips'
import get from 'lodash/get'

import { gql, useQuery } from '@apollo/client'

const ONHOLD_TRIPS_QUERY = gql`
query partner_onhold($cardcode: String) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    trips(where: {_and: [{trip_payables: {name: {_eq: "On-Hold"}}}, {deleted_at: {_is_null: true}}]}) {
      id
      paid_tat
      source{
        id
        name
      }
      destination{
        id
        name
      }
      truck{
        id
        truck_no
        truck_type{
          id
          name
        }
      }
      partner{
        id
        name
      }
      customer{
        id
        name
      }
      trip_payables_aggregate(where: {_and: 
        [
          {name: {_eq: "On-Hold"}}, 
          {deleted_at: {_is_null: true}}
        ]}) {
        aggregate {
          sum {
            amount
          }
        }
      }

    }
  }
}`
    


const onholdTrips = (props) => {
  const { visible, onHide ,cardcode} = props

  const statusList = [
    { value: 1, text: 'Opened' },
    { value: 11, text: 'Closed' }
  ]

  const { loading, error, data } = useQuery(ONHOLD_TRIPS_QUERY, {
    variables: {cardcode:cardcode},
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('Onhold trips error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const partner = get(_data, 'partner', null)

  const trips = get(_data,'partner[0].trips',null)

  console.log('trips',trips)
  console.log('partner',partner)

  const columns = [
    {
      title: 'LoadId',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      width: '6%',
      render: (text, record) => get(record, 'id',null)
    },
    {
      title: 'Source',
      dataIndex: 'name',
      width: '8%',
      render: (text, record) => get(record, 'source.name',null)
    },
    {
      title: 'Destination',
      dataIndex: 'name',
      width: '8%',
      render: (text, record) => get(record, 'destination.name',null)
    },
    {
      title: 'Truck',
      dataIndex: 'truck_no',
      sorter: (a, b) => (a.truck_no > b.truck_no ? 1 : -1),
      width: '8%',
      render: (text, record) => get(record, 'truck.truck_no',null)
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '6%',
      render: (text, record) => get(record, 'truck.truck_type.name',null)
    },
    {
      title: 'Partner',
      dataIndex: 'name',
      sorter: (a, b) => (a.partner > b.partner ? 1 : -1),
      width: '8%',
      render: (text, record) => get(record, 'partner.name',null)
    },
    {
      title: 'Customer',
      dataIndex: 'name',
      sorter: (a, b) => (a.customer > b.customer ? 1 : -1),
      width: '12%',
      render: (text, record) => get(record, 'customer.name',null)
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => (a.price > b.price ? 1 : -1),
      width: '6%'
    },
    {
      title: 'On-hold',
      dataIndex: 'onhold',
      sorter: (a, b) => (a.onhold > b.onhold ? 1 : -1),
      width: '10%'
    },
    {
      title: 'S/D',
      dataIndex: 'sd',
      sorter: (a, b) => (a.sd > b.sd ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Released',
      dataIndex: 'released',
      sorter: (a, b) => (a.released > b.released ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Aging',
      dataIndex: 'aging',
      sorter: (a, b) => (a.aging > b.aging ? 1 : -1),
      width: '6%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: statusList,
      width: '12%'
    }
  ]

  return (
    <Modal
      title='On-Hold Trips'
      visible={visible}
      onCancel={onHide}
      width={1200}
    >
      <Table
        columns={columns}
        dataSource={trips}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
      />
    </Modal>
  )
}
export default onholdTrips
