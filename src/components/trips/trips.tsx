import { useState } from 'react'
import { Table, Tooltip, Input, Pagination, Checkbox } from 'antd'
import Link from 'next/link'
import moment from 'moment'
import { SearchOutlined } from '@ant-design/icons'

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

  console.log('trips', trips)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '7%',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search TripId'
            value={filter.id}
            onChange={handleTripId}
          />
        </div>
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
      dataIndex: 'order_date',
      key: 'order_date',
      render: (text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : ''
      },
      width: '8%'
    },
    {
      title: 'Customer',
      render: (text, record) => {
        const cardcode = record.customer && record.customer.cardcode
        return (
          <Link href='/customers/[id]' as={`/customers/${cardcode} `}>
            {record.customer &&
            record.customer.name &&
            record.customer.name.length > 12 ? (
              <Tooltip title={record.customer && record.customer.name}>
                  <a>{record.customer.name.slice(0, 12) + '...'}</a>
                </Tooltip>
              ) : (
                <a>{record.customer && record.customer.name}</a>
              )}
          </Link>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Customer Name'
            value={filter.customername}
            onChange={handleCustomerName}
          />
        </div>
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
        return (
          <Link
            href='/partners/[id]'
            as={`/partners/${record.partner && record.partner.cardcode} `}
          >
            {record.partner &&
            record.partner.name &&
            record.partner.name.length > 12 ? (
              <Tooltip title={record.partner && record.partner.name}>
                  <a>
                    {record.partner && record.partner.name.slice(0, 12) + '...'}
                  </a>
                </Tooltip>
              ) : (
                <a>{record.partner && record.partner.name}</a>
              )}
          </Link>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Partner Name'
            value={filter.partnername}
            onChange={handlePartnerName}
          />
        </div>
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
        return (
          <Link
            href='/trucks/[id]'
            as={`/trucks/${record.truck && record.truck.truck_no} `}
          >
            <a>{record.truck && record.truck.truck_no}</a>
          </Link>
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Truck'
            value={filter.truck_no}
            onChange={handleTruckNo}
          />
        </div>
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
      render: (text, record) => {
        return text > 8 ? (
          <Tooltip title={record.source.name}>
            <span>{record.source.name.slice(0, 8) + '...'}</span>
          </Tooltip>
        ) : (
          record.source.name
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Source City'
            value={filter.sourcename}
            onChange={handleSourceName}
          />
        </div>
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
      render: (text, record) => {
        return text > 8 ? (
          <Tooltip title={record.destination.name}>
            <span>{record.destination.name.slice(0, 8) + '...'}</span>
          </Tooltip>
        ) : (
          record.destination.name
        )
      },
      filterDropdown: (
        <div>
          <Input
            placeholder='Search Destination City'
            value={filter.destinationname}
            onChange={handleDestinationName}
          />
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined
          style={{ color: filter.destinationname ? '#1890ff' : undefined }}
        />
      )
    },
    {
      title: 'Status',
      render: (text, record) => record.trip_status && record.trip_status.name,
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
      render: (record) => {
        console.log()
        return (
          record.trip_prices &&
          record.trip_prices.length > 0 &&
          record.trip_prices[0].customer_price
        )
      },
      width: '8%'
    },
    {
      title: 'PO Price',
      render: (record) => {
        return (
          record.trip_prices &&
          record.trip_prices.length > 0 &&
          record.trip_prices[0].partner_price
        )
      },
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
        scroll={{ x: 1156 }}
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
