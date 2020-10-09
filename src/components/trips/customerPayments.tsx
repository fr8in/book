import { Table } from 'antd'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'

const CustomerPayments = (props) => {
  const { dataSource, onShow, type_name } = props
  const { role } = u
  const edit_access = [role.admin, role.accounts_manager, role.accounts]

  const column = [{
    title: 'Type',
    render: (record) => (type_name + ' Pending'),
    width: '26%'
  },
  type_name === 'Final' ?
  {
    title: 'Doc No',
    width: '18%',
    // render: (text, record) => {
    //   const docEntry = type_name === 'Advance' ? record.base_Advance_DocEntry : type_name === 'Final' ? record.docentry : '-'
    //   console.log('docEntry',docEntry)
    //   return docEntry
    // }
  } : {},
  {
    title: 'Amount',
    width: '16%',
    render: ( record) => {
       const amounts = (type_name === 'Final') ? record.amount : record.freight
      return amounts
    }
  },
  {
    title: 'Recieved',
    width: '16%',
    render: ( record) => {
      const Recieved = (type_name === 'Final') ? record.received : record.received
     return Recieved
   }
  },
  {
    title: 'Balance',
    width: '18%',
    render: ( record) => {
      const Balance = (type_name === 'Final') ? record.balance : record.balance
     return Balance
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
