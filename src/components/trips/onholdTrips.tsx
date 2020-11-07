import { Modal, Table, Checkbox } from 'antd'
import { useState } from 'react'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'

const ONHOLD_TRIPS_QUERY = gql`
query partner_onhold($cardcode: String,$exp:float8_comparison_exp) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    trips(where: {_and: [{trip_payables: {name: {_eq: "On-Hold"},amount:$exp}}, {deleted_at: {_is_null: true}}]}) {
      id
      paid_tat
      source {
        id
        name
      }
      destination {
        id
        name
      }
      partner_price
      truck {
        id
        truck_no
        truck_type {
          id
          name
        }
      }
      partner {
        id
        name
      }
      customer {
        id
        name
      }
      trip_payables_aggregate(where: {_and: [{name: {_eq: "On-Hold"}}, {deleted_at: {_is_null: true}}]}) {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  }
}`

const OnholdTrips = (props) => {
  const status_list = [
    { value: 1, text: 'Open' },
    { value: 2, text: 'Closed' }
  ]

  const { visible, onHide, cardcode } = props
  const [filter, setFilter] = useState(['Open'])

  const { loading, error, data } = useQuery(ONHOLD_TRIPS_QUERY, {
    variables: {
      cardcode: cardcode,
      exp: filter.length > 1 ? null : filter[0] === 'Closed' ? { _eq: 0 } : filter[0] === 'Open' ? { _neq: 0 } : null
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  console.log('Onhold trips error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const trips = get(_data, 'partner[0].trips', null)

  const trip_status = status_list.map((data) => {
    return { value: data.text, label: data.text }
  })

  const handleStatusList = (checked) => {
    setFilter(checked)
  }
  const columns = [
    {
      title: 'LoadId',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      width: '8%',
      render: (text, record) => <LinkComp type='trips' data={get(record, 'id', null)} id={get(record, 'id', null)} blank />
    },
    {
      title: 'Source',
      dataIndex: 'name',
      width: '8%',
      render: (text, record) => <Truncate data={get(record, 'source.name', null)} length={4} />
    },
    {
      title: 'Destination',
      dataIndex: 'name',
      width: '11%',
      render: (text, record) => <Truncate data={get(record, 'destination.name', null)} length={8} />
    },
    {
      title: 'Truck',
      dataIndex: 'truck_no',
      sorter: (a, b) => (a.truck_no > b.truck_no ? 1 : -1),
      width: '9%',
      render: (text, record) => <Truncate data={get(record, 'truck.truck_no', null)} length={4} />
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '15%',
      render: (text, record) => <Truncate data={get(record, 'truck.truck_type.name', null)} length={15} />
    },
    {
      title: 'Customer',
      dataIndex: 'name',
      sorter: (a, b) => (a.customer > b.customer ? 1 : -1),
      width: '14%',
      render: (text, record) => <Truncate data={get(record, 'customer.name', null)} length={12} />
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => (a.price > b.price ? 1 : -1),
      width: '8%',
      render: (text, record) => get(record, 'partner_price', null)
    },
    {
      title: 'On-hold',
      dataIndex: 'onhold',
      sorter: (a, b) => (a.onhold > b.onhold ? 1 : -1),
      width: '11%',
      render: (text, record) => get(record, 'trip_payables_aggregate.aggregate.sum.amount', null)
    },
    {
      title: 'Aging',
      dataIndex: 'paid_tat',
      sorter: (a, b) => (parseInt(a.aging, 10) > parseInt(b.aging) ? 1 : -1),
      width: '7%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '8%',
      render: (text, record) =>
        get(record, 'trip_payables_aggregate.aggregate.sum.amount', 0) !== 0 ? 'open' : 'closed',
      filterDropdown: (
        <Checkbox.Group
          options={trip_status}
          defaultValue={filter}
          onChange={handleStatusList}
          className='filter-drop-down'
        />
      )
    }
  ]

  return (
    <Modal
      title='On-Hold Trips'
      visible={visible}
      onCancel={onHide}
      width={1200}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={trips}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
        loading={loading}
      />
    </Modal>
  )
}
export default OnholdTrips
