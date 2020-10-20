import { Table } from 'antd'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'

const CustomerPayments = (props) => {
  const { dataSource, onShow, type_name, lock } = props
  const { role } = u
  const edit_access = [role.admin, role.accounts_manager, role.accounts]

  const final_booking_check = dataSource && dataSource.length > 1

  const column = [{
    title: 'Type',
    render: (record) => record && record.invoicetype ? record.invoicetype : 'Advance Pending',
    width: '26%'
  },
  !type_name ? {
    title: 'Doc No',
    dataIndex: 'docentry',
    width: '18%'
  } : {},
  {
    title: 'Amount',
    width: '16%',
    render: (record) => {
      const amounts = type_name ? record.amount : record.freight
      return amounts
    }
  },
  {
    title: 'Received',
    width: '16%',
    render: (record) => {
      const Received = record.received
      return Received
    }
  },
  {
    title: 'Balance',
    width: '18%',
    render: (record) => {
      const Balance = record.balance
      return Balance
    }
  },
  {
    title: 'Edit',
    width: '6%',
    render: (record) => (
      <EditAccess
        lock={lock}
        edit_access={edit_access}
        onEdit={type_name ? onShow : () => onShow(record)}
        disable={final_booking_check && record.doctype === 'I'}
      />
    )
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
