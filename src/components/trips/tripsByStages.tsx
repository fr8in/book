
import { Table } from 'antd'
import mock from '../../../mock/trip/tripsByStages'
import Link from 'next/link'

const Partners = (props) => {
  const { trips } = props
  
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
      render: (text, record) => {
        return (record.order_date)
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
      title: 'Load Km',
      dataIndex: 'load',
    } : 
    {
      title: 'SourceIn',
      dataIndex: 'cityIn'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => {
        return (record.trip_status.value)
      }
    },
    props.trip ? {
      title: 'AVG KM/Day',
      dataIndex: 'avg',
    } : {},

  ]
  return (
    <Table
      columns={columnsCurrent}
      dataSource={trips}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 900, y: 270 }}
      pagination={false}
    />
  )
}

export default Partners
