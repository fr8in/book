import {useState} from 'react'
import { Table,Pagination } from 'antd'
// import mock from '../../../mock/trip/tripsByStages'
import Link from 'next/link'
import moment from 'moment'

const Partners = (props) => {
  const { 
    trips, 
    loading,
    filter,
    record_count,
    total_page,
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
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{record.id}</a>
          </Link>)
      }
    },
    {
      title: 'OrderDate',
      dataIndex: 'order_date',
      render:(text, record) => {
        return text ? moment(text).format('DD-MMM-YY') : null
      }
    },
    {
      title: 'Source',
      dataIndex: 'source',
      render: (text, record) => {
        return (record.source.name)
      }
    },
    {
      title: 'Destination',
      dataIndex: 'city',
      render: (text, record) => {
        return (record.destination.name)
      }
    },
    props.trip ? {
      title: 'Km',
      dataIndex: 'km',
      render: (text, record) => {
        return (record.km)
      }
    }
      : {
        title: 'SourceIn',
        dataIndex: 'source_in',
        render:(text, record) => {
          return text ? moment(text).format('DD-MMM-YY') : null
        }
      },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        return (record.trip_status.name)
      }
    },
    props.trip ? {
      title: 'AVG KM/Day',
      dataIndex: 'avg',
      render: (text, record) => {
        return (record.avg_km_day)
      }
    } : {}

  ]
  return (
    <>
    <Table
      columns={columnsCurrent}
      dataSource={trips}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 900, y: 400 }}
      pagination={false}
      loading={loading}
    />
    {!loading &&  record_count &&
        <Pagination
          size='small'
          current={currentPage}
          pageSize={filter.limit}
          total={record_count}
          onChange={pageChange}
          className='text-right p10'
        />}
    </>
  )
}

export default Partners
