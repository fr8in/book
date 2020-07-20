import { Table, Row, Col } from 'antd'
import data from '../../../mock/trip/chargesAndPayments'
import moment from 'moment'

const Payables = () => {
  const vendorChargeColumns = [
    {
      title: 'Charges',
      dataIndex: 'name'
    },
    {
      title: <div className='text-right'> Amount</div>,
      dataIndex: 'amount',
      render: (text, record) => {
        return text
          ? <div className='text-right'> {text.toFixed(2)}</div>
          : <div className='text-right'>0</div>
      }
    }
  ]
  const vendorAdvanceColumn = [{
    title: 'Mode',
    dataIndex: 'mode',
    key: 'mode',
    width: '40%'
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: '30%',
    render: (text, record) => {
      return text ? moment(text, 'x').format('MMM DD YYYY') : null
    }
  },
  {
    title: <div className='text-right'>Amount</div>,
    dataIndex: 'amount',
    key: 'amount',
    width: '30%',
    render: (text, record) => {
      return text
        ? <div className='text-right'> {text ? text.toFixed(2) : 0}</div>
        : <div className='text-right'>0</div>
    }
  }
  ]
  return (
    <>
      <Table
        dataSource={data.loadVendorCharge}
        columns={vendorChargeColumns}
        pagination={false}
        size='small'
      />
      <Row className='p10' gutter={6}>
        <Col xs={12}><b>Payments</b></Col>
        <Col xs={12} className='text-right'>
          <b>{23000}</b>
        </Col>
      </Row>
      <Table
        columns={vendorAdvanceColumn}
        dataSource={data.loadVendorPayment}
        scroll={{ x: '300' }}
        pagination={false}
        size='small'
      />
    </>
  )
}

export default Payables
