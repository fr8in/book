import { useState } from 'react'
import { Table, Tooltip, Input, Pagination, Checkbox } from 'antd'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import LinkComp from '../common/link'
import Truncate from '../common/truncate'

const Trips = (props) => {
  const {
    trips,
    loading,
    record_count,
    onPageChange,
    filter,
    onPartnerNameSearch,
    onCustomerNameSearch,
    trip_status_list,
    onFilter,
    onSourceNameSearch,
    onDestinationNameSearch,
    onTruckNoSearch,
    onTripIdSearch
  } = props

  const [currentPage, setCurrentPage] = useState(1)

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }
  const handlePartnerName = (e) => {
    onPartnerNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleCustomerName = (e) => {
    onCustomerNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleSourceName = (e) => {
    onSourceNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleDestinationName = (e) => {
    onDestinationNameSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleTruckNo = (e) => {
    onTruckNoSearch(e.target.value)
    setCurrentPage(1)
  }
  const handleStatus = (checked) => {
    onFilter(checked)
    setCurrentPage(1)
  }
  const handleTripId = (e) => {
    onTripIdSearch(e.target.value)
    setCurrentPage(1)
  }

  const trip_status = trip_status_list.map((data) => {
    return { value: data.name, label: data.name }
  })

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '7%',
      render: (text, record) => <LinkComp type='trips' data={text} id={record.id} blank />,
      filterDropdown: (
        <Input
          placeholder='Search TripId'
          value={filter.id}
          onChange={handleTripId}
        />
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: filter.id ? '#1890ff' : undefined }} />
      )
    },
    {
      title: (
        <Tooltip title='Order date'>
          <span>O.Date</span>
        </Tooltip>
      ),
      dataIndex: 'created_at',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : '',
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      width: '8%'
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = get(record, 'customer.cardcode', null)
        const name = get(record, 'customer.name', null)
        return (
          <LinkComp type='customers' data={name} id={cardcode} length={12} blank />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search Customer Name'
          value={filter.customername}
          onChange={handleCustomerName}
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.customername ? '#1890ff' : undefined }}
        />
      ),
      width: '11%'
    },
    {
      title: 'Partner',
      render: (text, record) => {
        const cardcode = get(record, 'partner.cardcode', null)
        const name = get(record, 'partner.name', null)
        return (
          <LinkComp type='partners' data={name} id={cardcode} length={12} blank />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search Partner Name'
          value={filter.partnername}
          onChange={handlePartnerName}
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.partnername ? '#1890ff' : undefined }}
        />
      ),
      width: '11%'
    },
    {
      title: 'Truck',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        return (
          <LinkComp type='trucks' data={truck_no} id={truck_no} blank />
        )
      },
      filterDropdown: (
        <Input
          placeholder='Search Truck'
          value={filter.truck_no}
          onChange={handleTruckNo}
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.truck_no ? '#1890ff' : undefined }}
        />
      ),
      width: '10%'
    },
    {
      title: 'Source',
      width: '9%',
      render: (text, record) => <Truncate data={get(record, 'source.name', '')} length={10} />,
      filterDropdown: (
        <Input
          placeholder='Search Source City'
          value={filter.sourcename}
          onChange={handleSourceName}
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.sourcename ? '#1890ff' : undefined }}
        />
      )
    },
    {
      title: 'Destination',
      width: '10%',
      render: (text, record) => <Truncate data={get(record, 'destination.name', '')} length={10} />,
      filterDropdown: (
        <Input
          placeholder='Search Destination City'
          value={filter.destinationname}
          onChange={handleDestinationName}
        />
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.destinationname ? '#1890ff' : undefined }}
        />
      )
    },
    {
      title: 'Status',
      render: (text, record) => get(record, 'trip_status.name', ''),
      width: '10%',
      filterDropdown: (
        <Checkbox.Group
          options={trip_status}
          defaultValue={filter.trip_statusName}
          onChange={handleStatus}
          className='filter-drop-down'
        />
      )
    },
    {
      title: 'SO Price',
      render: (record) => record.customer_price,
      width: '8%'
    },
    {
      title: 'PO Price',
      render: (record) => record.partner_price,
      width: '8%'
    },
    {
      title: 'Trip KM',
      dataIndex: 'km',
      key: 'km',
      width: '8%'
    }
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={trips}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 1156, y: 530 }}
        pagination={false}
        loading={loading}
      />
      {!loading && record_count ? (
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />
      ) : null}
    </>
  )
}

export default Trips
