import { Table } from 'antd'
import { EditTwoTone } from '@ant-design/icons'

const CustomerPayments = (props) => {
  const { dataSource, onShow, type_name } = props

  const column = [{
    title: 'Type',
    dataIndex: 'type',
    render: () => type_name + ' Pending',
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
    dataIndex: 'amount',
    width: '18%'
  },
  {
    title: 'Recieved',
    dataIndex: 'recevied',
    render: (text, record) => text || 0,
    width: '18%'
  },
  {
    title: 'Balance',
    dataIndex: 'pending',
    width: '20%'
  },
  {
    title: 'Edit',
    dataIndex: 'edit',
    render: () => <EditTwoTone onClick={onShow} />
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
