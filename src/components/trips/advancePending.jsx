import { Table, Input } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { SearchOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import { useState } from 'react'

const ADVANCE_PENDING_QUERY = gql`
query advancePending(
  $cardcode: String,
  $partner_name:String,
  $truck_no:String,
  $source_name:String,
  $destination_name:String
  ){
  trip(where: 
    {customer: {cardcode: {_eq: $cardcode}},
      source_out: {_is_null: false},
      trip_status: {name: {_neq: "Cancelled"}},
      trip_accounting: {receipt: {_is_null: true}},
      partner:{name:{_ilike:$partner_name}},
      truck:{truck_no:{_ilike:$truck_no}},
      source:{name:{_ilike:$source_name}},
      destination:{name:{_ilike:$destination_name}}
    })
  {
    id
    created_at
    advance_tat
    customer {
      name
    }
    trip_status {
      name
    }
    truck {
      truck_no
      truck_type{
        name
      }
    }
    partner {
      name
    }
    source {
      name
    }
    destination {
      name
    }
    trip_receipts_aggregate {
      aggregate {
        sum {
          amount
        }
      }
    }
    trip_receivables_aggregate {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
}
`
const AdvancePending = (props) => {
  const { cardcode } = props
  const initialFilter = {
    partner_name: null,
    truck_no: null,
    source_name: null,
    destination_name: null
  }
  const [filter, setFilter] = useState(initialFilter)

  const { loading, error, data } = useQuery(
    ADVANCE_PENDING_QUERY,
    {
      variables: {
        cardcode: cardcode,
        partner_name: filter.partner_name ? `%${filter.partner_name}%` : null,
        truck_no: filter.truck_no ? `%${filter.truck_no}%` : null,
        source_name: filter.source_name ? `%${filter.source_name}%` : null,
        destination_name: filter.destination_name ? `%${filter.destination_name}%` : null
      }
    }
  )
  console.log('Advance pending error', error)
  console.log('Advance pending data', data)
  let _data = []
  if (!loading) {
    _data = data
  }
  const trips = get(_data, 'trip', null)
  console.log('trips', trips)

  const onTruckNoSearch = (e) => {
    setFilter({ ...filter, truck_no: e.target.value })
  }
  const onPartnerNameSearch = (e) => {
    setFilter({ ...filter, partner_name: e.target.value })
  }
  const onSourceNameSearch = (e) => {
    setFilter({ ...filter, source_name: e.target.value })
  }
  const onDestinationNameSearch = (e) => {
    setFilter({ ...filter, destination_name: e.target.value })
  }

  const advancePending = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => (a.id > b.id ? 1 : -1),
      width: '6%',
      render: (text, record) => (
        <LinkComp
          type='trips'
          data={text}
          id={record.id}
        />
      )
    },
    {
      title: 'O.Date',
      dataIndex: 'created_at',
      width: '8%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-'
    },
    {
      title: 'Truck No',
      width: '16%',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type_name = get(record, 'truck.truck_type.name', null)
        const truck_type = truck_type_name ? truck_type_name.slice(0, 9) : null
        return (
          <LinkComp
            type='trucks'
            data={`${truck_no} - ${truck_type}`}
            id={truck_no}
          />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.truck_no}
          onChange={onTruckNoSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Partner',
      width: '10%',
      render: (text, record) => {
        const partner = get(record, 'partner.name', null)
        const cardcode = get(record, 'partner.cardcode', null)
        return (
          <LinkComp
            type='partners'
            data={partner}
            id={cardcode}
            length={10}
          />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.partner_name}
          onChange={onPartnerNameSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Source',
      width: '10%',
      render: (text, record) => get(record, 'source.name', '-'),
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.source_name}
          onChange={onSourceNameSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Destination',
      width: '10%',
      render: (text, record) => get(record, 'destination.name', '-'),
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.destination_name}
          onChange={onDestinationNameSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    {
      title: 'Status',
      width: '8%',
      render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={15} />
    },
    {
      title: 'Receivable',
      width: '8%',
      sorter: (a, b) => (a.receivable > b.receivable ? 1 : -1),
      render: (record) => get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
    },
    {
      title: 'Receipts',
      width: '7%',
      sorter: (a, b) => (a.receipts > b.receipts ? 1 : -1),
      render: (record) => get(record, 'trip_receipts_aggregate.aggregate.sum.amount', 0)
    },
    {
      title: 'Balance',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: '7%',
      render: (record) => {
        const receivable = get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
        const receipts = get(record, 'trip_receipts_aggregate.aggregate.sum.amount', 0)
        return (receivable - receipts)
      }
    },
    {
      title: 'Aging',
      key:'advance_tat',
      dataIndex:'advance_tat',
      sorter: (a, b) => (a.advance_tat-b.advance_tat),
      defaultSortOrder: 'descend',
      width: '7%'
    }
  ]
  return (
    <Table
      columns={advancePending}
      dataSource={trips}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
      loading={loading}
    />
  )
}
export default AdvancePending