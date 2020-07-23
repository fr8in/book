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
      dataIndex: 'mobile'
    },
    {
      title: 'No of Loads',
      dataIndex: 'no_of_loads_taken',
      sorter: true
    },
    {
      title: 'System Mamul',
      dataIndex: 'system_mamul'
    },
    {
      title: 'Credit Limit',
      dataIndex: 'credit_limit'
    },
    {
      title: 'Receivables',
      dataIndex: 'receivables'
    },
    {
      title: 'Receivable Days',
      dataIndex: 'working_capital_days'
    },
    {
      title: 'Status',
      dataIndex: 'status'
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
