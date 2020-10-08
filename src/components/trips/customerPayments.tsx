import { Table } from 'antd'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'

const CustomerPayments = (props) => {
  const { dataSource, onShow, type_name } = props
  const { role } = u
  const edit_access = [role.admin, role.accounts_manager, role.accounts]

  const column = [{
    title: 'Type',
    render: (record) => (record && record.invoicetype) ? record.invoicetype : (type_name + ' Pending'),
    width: '26%'
  },
  {
    title: 'Doc No',
    width: '18%',
    render: (text, record) => {
      const docEntry = type_name === 'Advance' ? record.base_Advance_DocEntry : type_name === 'Final' ? record.docentry : '-'
      return docEntry
    }
  },
  {
    title: 'Amount',
    width: '16%',
    render: (text, record) => {
      const amount = (type_name === 'Final') ? record.freight : record.amount
      return amount
    }
  },
  {
    title: 'Recieved',
    width: '16%',
    render: (text, record) => record.received
  },
  {
    title: 'Balance',
    width: '18%',
    render: (text, record) => {
      const pending = (type_name === 'Final') ? record.balance : record.pending
      return pending
    }
  },
  {
    title: 'Edit',
    width: '6%',
    render: (record) => <EditAccess edit_access={edit_access} onEdit={(type_name === 'Final') ? () => onShow(record) : onShow} />
  }]

  return (
    <Table
      columns={column}
      dataSource={dataSource}
      pagination={false}
      rowKey={record => record.trip_id}
      scroll={{ x: 400 }}
      size='small'
    />
  )
}

export default CustomerPayments
