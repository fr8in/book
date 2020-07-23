import { Table } from 'antd'
import Link from 'next/link'

const Customers = (props) => {
  const { customers } = props
  const columnsCurrent = [
    {
      title: 'Customer',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Link
            href='customers/[id]'
            as={`customers/${record.cardcode}`}
          >
            <a>{text}</a>
          </Link>
        )
      }
    },
    {
      title: 'User Phone',
      dataIndex: 'mobileNo'
    },
    {
      title: 'Orders',
      dataIndex: 'noOfLoadsTaken',
      sorter: true
    },
    {
      title: 'systemMamul',
      dataIndex: 'systemMamul'
    },
    {
      title: 'Credit Limit',
      dataIndex: 'creditLimit'
    },
    {
      title: 'Receivables',
      dataIndex: 'receivables'
    },
    {
      title: 'Receivable Days',
      dataIndex: 'workingCapitalDays'
    },
    {
      title: 'Status',
      dataIndex: 'Status'
    }
  ]

  return (
    <Table
      columns={columnsCurrent}
      dataSource={customers}
      rowKey={record => record.id}
      size='small'
      scroll={{ x: 800, y: 400 }}
      pagination={false}
    />
  )
}

export default Customers
