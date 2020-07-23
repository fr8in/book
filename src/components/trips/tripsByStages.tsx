
import { Table } from 'antd'
import mock from '../../../mock/trip/tripsByStages'
import Link from 'next/link'

const Partners = () => {
  const columnsCurrent = [
    {
      title: 'ID',
      dataIndex: 'code',
      render: (text, record) => {
        return (
          <Link href='/trips/[id]' as={`/trips/${record.id} `}>
            <a>{text}</a>
          </Link>)
      }
    },
    {
      title: 'OrderDate',
      dataIndex: 'date'
    },
    {
      title: 'Source',
      dataIndex: 'source'
    },
    {
      title: 'Destination',
      dataIndex: 'city'
    },
    {
      title: 'SourceIn',
      dataIndex: 'cityIn'
    },
    {
      title: 'Status',
      dataIndex: 'status'
    }

  ]
  return (
    <Table
      columns={columnsCurrent}
      dataSource={mock}
      rowKey={record => record.id}
      size='middle'
      scroll={{ x: 900, y: 270 }}
      pagination={false}
    />
  )
}

export default Partners
