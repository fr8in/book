import { Table, Row, Col } from 'antd'
import { EditTwoTone } from '@ant-design/icons'
import customerPending from '../../../mock/trip/payment'
import EditModal from './AdvanceBookingEdit'
import useShowHide from '../../hooks/useShowHide'

const CustomerPayments = () => {
  const initial = { edit: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const column = [{
    title: 'Type',
    dataIndex: 'type',
    render: () => 'Advance',
    width: '20%'
  },
  {
    title: 'Doc No',
    dataIndex: 'docEntry',
    width: '20%'
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    width: '20%'
  },
  {
    title: 'Recieved',
    dataIndex: 'recevied',
    render: (text, record) => text || 0,
    width: '20%'
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    width: '20%'
  },
  {
    title: 'Edit',
    dataIndex: 'edit',
    render: () => <EditTwoTone onClick={() => onShow('edit')} />
  }]

  return (
    <>
      <Row className='payableHead' gutter={6}>
        <Col xs={24}><b>Advance Payments</b></Col>
      </Row>
      <Table
        columns={column}
        dataSource={customerPending}
        pagination={false}
        rowKey={record => record.id}
        scroll={{ x: 400 }}
        size='small'
      />
      <Row className='payableHead' gutter={6}>
        <Col xs={24}><b>Invoice Pending Payments</b></Col>
      </Row>
      <Table
        columns={column}
        dataSource={customerPending}
        rowKey={record => record.id}
        scroll={{ x: 400 }}
        pagination={false}
        size='small'
      />
      <Row className='payableHead' gutter={6}>
        <Col xs={24}><b>Pending Payments</b></Col>
      </Row>
      <Table
        columns={column}
        dataSource={customerPending}
        rowKey={record => record.id}
        scroll={{ x: 400 }}
        pagination={false}
        size='small'
      />
      <div className='payableHead'>
        <h4 className='text-center'>100% payment recieved from customer</h4>
      </div>
      {visible.edit && <EditModal visible={visible.edit} onHide={onHide} />}
    </>
  )
}

export default CustomerPayments
