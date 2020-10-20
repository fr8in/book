import { Table } from 'antd'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'

const CustomerPayments = (props) => {
  const { dataSource, onShow, type_name, lock } = props
  const { role } = u
  const edit_access = [role.admin, role.accounts_manager, role.accounts]

  const column = [{
    title: 'Type',
    render: (record) => record && record.invoicetype ? record.invoicetype : (type_name + ' Pending'),
    width: '26%'
  },
  type_name === 'Final' ? {
    title: 'Doc No',
    dataIndex: 'docentry',
    width: '18%'
  } : {},
  {
    title: 'Amount',
    width: '16%',
    render: (record) => {
      const amounts = (type_name === 'Final') ? record.freight : record.amount
      return amounts
    }
  },
  {
    title: 'Received',
    width: '16%',
    render: (record) => {
      const Received = (type_name === 'Final') ? record.received : record.received
      return Received
    }
  },
  {
    title: 'Balance',
    width: '18%',
    render: (record) => {
      const Balance = (type_name === 'Final') ? record.balance : record.balance
      return Balance
    }
  },
  {
    title: 'Edit',
    width: '6%',
    render: (record) => <EditAccess lock={lock} edit_access={edit_access} onEdit={type_name ? onShow : () => onShow(record)} />
  }]

  return (
    <Table
      columns={column}
      dataSource={dataSource}
      pagination={false}
      rowKey={record => record.docentry}
      scroll={{ x: 400 }}
      size='small'
    />
  )
}

export default CustomerPayments
