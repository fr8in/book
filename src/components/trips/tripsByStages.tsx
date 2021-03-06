import { useState } from 'react'
import { Table, Pagination,Tooltip } from 'antd'
import moment from 'moment'
import LinkComp from '../common/link'
import get from 'lodash/get'
import Link from 'next/link'
import Truncate from '../common/truncate'

const TripsByStages = (props) => {
  const {
    trips,
    loading,
    filter,
    record_count,
    onPageChange,
    truckPage,
    partnerPage
  } = props
  const [currentPage, setCurrentPage] = useState(1)

  const pageChange = (page, pageSize) => {
    const newOffset = page * pageSize - filter.limit
    setCurrentPage(page)
    onPageChange(newOffset)
  }
  const columnsCurrent = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '9%',
      render: (text, record) => (
        <LinkComp
          type='trips'
          data={record.id}
          id={record.id}
        />),
        sorter: (a, b) => (a.id > b.id ? 1 : -1)
    },
    {
      title: 'Order date',
      dataIndex: 'created_at',
      width: '12%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
    },
    partnerPage ? {
      title: 'Customer',
      dataIndex: 'customer',
      width: '19%',
      render: (text, record) => {
        const cardcode = get(record, 'customer.cardcode',null)
        const name = get(record, 'customer.name', null)
       return (
          <Link href='/customers/[id]' as={`/customers/${cardcode} `}>
            {name && name.length > 17
              ? <Tooltip title={name}><a>{name.slice(0, 24) + '...'}</a></Tooltip>
              : <a>{name}</a>}
          </Link>)
         }
    } : {},
    partnerPage ? {
      title: 'Truck',
      width: '25%',
      render: (text, record) => {
        const truck_no = get(record, 'truck.truck_no', null)
        const truck_type = get(record, 'truck.truck_type.name', null)
        return (
          <LinkComp
            type='trucks'
            data={truck_no + ' - ' + truck_type}
            id={truck_no}
            length={32}
          />
          )
      }
    } : {},
    {
      title: 'Source',
      dataIndex: 'source',
      width: '14%',
      render: (text, record) => <Truncate data={get(record, 'source.name', '-')} length={11} />,
    },
    {
      title: 'Destination',
      width: '13%',
      render: (text, record) => <Truncate data={get(record, 'destination.name', '-')} length={10} />,
    },
    truckPage ? {
      title: 'Km',
      dataIndex: 'km',
      width: '13%',
      render: (text, record) => (record.km || '-')
    }
      : {
        title: 'SourceIn',
        dataIndex: 'source_in',
        width: '10%',
        render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
      },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '12%',
      render: (text, record) => <Truncate data={get(record, 'trip_status.name', '-')} length={9} />,
    },
    truckPage ? {
      title: 'AVG KM/Day',
      dataIndex: 'avg_km_day',
      width: '12%',
      render: (text, record) => (record.avg_km_day || '-')
    } : {}

  ]
  return (
    <>
      <Table
        columns={columnsCurrent}
        dataSource={trips}
        rowKey={record => record.id}
        size='small'
        scroll={{ x: 900, y: 350 }}
        pagination={false}
        loading={loading}
      />
      {!loading && record_count &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          showSizeChanger={false}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />}
    </>
  )
}

export default TripsByStages
