import { Table, Modal } from 'antd'
import bookedAmount from '../../../mock/customer/bookedAmount'
import IncomingPayments from './incomingPayments'

const BookedDetail = (props) => {
  const { visible, onHide } = props

  const onSubmit = () => {
    console.log('data Transfered!')
    onHide()
  }

  const columns = [{
    title: 'Date',
    dataIndex: 'date',
    width: '10%'
  },
  {
    title: 'Amount',
    dataIndex: 'recevied',
    width: '10%'
  },
  {
    title: 'Booked',
    dataIndex: 'booked',
    width: '10%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    width: '10%'
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    width: '60%'
  }]

  return (
    <Modal
      title='Booked Amount'
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={800}
      bodyStyle={{ padding: 5 }}
    >
      <Table
        columns={columns}
        dataSource={bookedAmount}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 780, y: 400 }}
        pagination={false}
        expandedRowRender={data => {
          return (
            <IncomingPayments docEntry={data.docEntry} />
          )
        }}
      />
    </Modal>

  )
}

export default BookedDetail
