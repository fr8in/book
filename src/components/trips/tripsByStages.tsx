import { useState } from 'react'
import { Table, Pagination } from 'antd'
import moment from 'moment'
import LinkComp from '../common/link'
import get from 'lodash/get'

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
      width: '12%',
      render: (text, record) => (
        <LinkComp
          type='trips'
          data={record.id}
          id={record.id}
        />)
    },
    {
      title: 'OrderDate',
      dataIndex: 'order_date',
      width: '13%',
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
    },
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
          />)
      }
    } : {},
    {
      title: 'Source',
      dataIndex: 'source',
      width: '15%',
      render: (text, record) => record.source.name
    },
    {
      title: 'Destination',
      width: '15%',
      render: (text, record) => record.destination.name
    },
    truckPage ? {
      title: 'Km',
      dataIndex: 'km',
      width: '13%',
      render: (text, record) => record.km
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
      width: '10%',
      render: (text, record) => record.trip_status.name
    },
    truckPage ? {
      title: 'AVG KM/Day',
      dataIndex: 'avg',
      width: '12%',
      render: (text, record) => record.avg_km_day
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
