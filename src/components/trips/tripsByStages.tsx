import { useState } from 'react'
import { Table, Pagination } from 'antd'
import moment from 'moment'
import LinkComp from '../common/link'

const TripsByStages = (props) => {
  const {
    trips,
    loading,
    filter,
    record_count,
    onPageChange
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
      render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
    },
    {
      title: 'Source',
      dataIndex: 'source',
      render: (text, record) => record.source.name
    },
    {
      title: 'Destination',
      dataIndex: 'city',
      render: (text, record) =>  record.destination.name
    },
    props.trip ? {
      title: 'Km',
      dataIndex: 'km',
      render: (text, record) => record.km
    }
      : {
        title: 'SourceIn',
        dataIndex: 'source_in',
        render: (text, record) => text ? moment(text).format('DD-MMM-YY') : null
      },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => record.trip_status.name
    },
    props.trip ? {
      title: 'AVG KM/Day',
      dataIndex: 'avg',
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
