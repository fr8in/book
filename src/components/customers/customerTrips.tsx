import { Table, Input } from 'antd'
import { useState } from 'react'
import CUSTOMER_TRIPS from './containers/query/customerTrips'
import { useSubscription } from '@apollo/client'
import { SearchOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import moment from 'moment'
import Truncate from '../common/truncate'
import LinkComp from '../common/link'
import PartnerLink from '../common/PartnerLink'
const CustomerTrips = (props) => {
  const { cardcode, status_names, delivered ,tat_name} = props

  const initialFilter = {
    partnername: null,
    sourcename: null,
    destinationname: null,
    truckno: null
  }

  const [filter, setFilter] = useState(initialFilter)

  const variables = {
    cardcode: cardcode,
    where: {
      trip_status: { name: { _in: status_names } },
      partner: { name: { _ilike: filter.partnername ? `%${filter.partnername}%` : null } },
      source: { name: { _ilike: filter.sourcename ? `%${filter.sourcename}%` : null } },
      destination: { name: { _ilike: filter.destinationname ? `%${filter.destinationname}%` : null } },
      truck: { truck_no: { _ilike: filter.truckno ? `%${filter.truckno}%` : null } }
    }
  }

  const { loading, error, data } = useSubscription(
    CUSTOMER_TRIPS,
    {
      variables: variables
    }
  )

  let _data = []
  if (!loading) {
    _data = data
  }
  const trips = get(_data, 'customer[0].trips', [])

  const onTruckNoSearch = (e) => {
    setFilter({ ...filter, truckno: e.target.value })
  }
  const onPartnerNameSearch = (e) => {
    setFilter({ ...filter, partnername: e.target.value })
  }
  const onSourceNameSearch = (e) => {
    setFilter({ ...filter, sourcename: e.target.value })
  }
  const onDestinationNameSearch = (e) => {
    setFilter({ ...filter, destinationname: e.target.value })
  }

  const tat = (record) => {
    const status = get(record, 'trip_status.name', null)
    let tat = null
    switch (status) {
      case 'Assigned':
        tat = record.confirmed_tat
        break
      case 'Confirmed':
        tat = record.confirmed_tat
        break
      case 'Reported at source':
        tat = record.loading_tat
        break
      case 'Intransit':
        tat = record.intransit_tat
        break
      case 'Intransit halting':
        tat = record.intransit_tat
        break
      case 'Reported at destination':
        tat = record.unloading_tat
        break
      case 'Delivered':
        tat = record.delivered_tat
        break
      case 'Invoiced':
        tat = record.received_tat
        break
      case 'Paid':
        tat = record.received_tat
        break
      case 'Recieved':
        tat = record.received_tat
        break
      case 'Closed':
        tat = record.closed_tat
        break
    }
    return parseInt(tat, 10)
  }

  const finalPaymentsPending = [
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
      width: '13%',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type_name = get(record, 'truck.truck_type.code', null)
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
          value={filter.truckno}
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
        const id = get(record, 'partner.id', null)
        const partner = get(record, 'partner.name', null)
        const cardcode = get(record, 'partner.cardcode', null)
        return (
          <PartnerLink
            type='partners'
            data={partner}
            id={id}
            cardcode={cardcode}
            length={10}
          />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search'
          value={filter.partnername}
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
          value={filter.sourcename}
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
          value={filter.destinationname}
          onChange={onDestinationNameSearch}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      )
    },
    !delivered
      ? {
        title: 'Status',
        width: '11%',
        render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={15} />
      }
      : {},
    delivered
      ? {
        title: 'Pod Verified at',
        width: '11%',
        dataIndex: 'pod_verified_at',
        render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '-'
      }
      : {},
    {
      title: 'Receivable',
      width: '9%',
      sorter: (a, b) => (a.receivable > b.receivable ? 1 : -1),
      render: (record) => get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
    },
    {
      title: 'Receipts',
      width: '8%',
      sorter: (a, b) => (a.receipts > b.receipts ? 1 : -1),
      render: (record) => get(record, 'trip_receipts_aggregate.aggregate.sum.amount', 0)
    },
    {
      title: 'Balance',
      sorter: (a, b) => (a.balance > b.balance ? 1 : -1),
      width: '8%',
      render: (record) => {
        const receivable = get(record, 'trip_receivables_aggregate.aggregate.sum.amount', 0)
        const receipts = get(record, 'trip_receipts_aggregate.aggregate.sum.amount', 0)
        return (receivable - receipts)
      }
    },
    {
      title: 'Aging',
      render: (text, record) => tat(record),
      sorter: (a, b) => {
        const status = get(a, 'trip_status.name', null)
        return status ? (tat(a) > tat(b) ? 1 : -1) : null
      },
      width: '7%'
    }
  ]

  return (
    <Table
      columns={finalPaymentsPending}
      dataSource={trips}
      rowKey={(record) => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
      loading={loading}
    />
  )
}

export default CustomerTrips
