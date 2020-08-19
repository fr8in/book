import { Table, Row, Col } from 'antd'
//import data from '../../../mock/trip/chargesAndPayments'
import moment from 'moment'

const Payables = (props) => {
  const {trip_pay} =props

  const mode = trip_pay && trip_pay.trip_partner_payment &&trip_pay.trip_partner_payment.length > 0 && trip_pay.trip_partner_payment[0].mode ? trip_pay.trip_partner_payment[0].mode : 'null'
  const amount = trip_pay && trip_pay.trip_partner_payment &&trip_pay.trip_partner_payment.length > 0 && trip_pay.trip_partner_payment[0].amount ? trip_pay.trip_partner_payment[0].amount : 'null'
  const date = trip_pay && trip_pay.trip_partner_payment &&trip_pay.trip_partner_payment.length > 0 && trip_pay.trip_partner_payment[0].date ? trip_pay.trip_partner_payment[0].date : 'null'
  
 
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
    key: 'mode',
    width: '40%',
    render: (record) => {
      console.log();
      return (mode);
    },
  },
  {
    title: 'Date',
    key: 'date',
    width: '30%',
    render: (text, record) => {
      return date ? moment(date).format('DD MMM YYYY') : null
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
        dataSource={trip_pay.trip_partner_charge}
        columns={vendorChargeColumns}
        pagination={false}
        size='small'
      />
      <Row className='payableHead' gutter={6}>
        <Col xs={12}><b>Payments</b></Col>
        <Col xs={12} className='text-right'>
          <b>{amount}</b>
        </Col>
      </Row>
      <Table
        columns={vendorAdvanceColumn}
        dataSource={trip_pay.trip_partner_payment}
        scroll={{ x: '300' }}
        pagination={false}
        size='small'
      />
    </>
  )
}

export default Payables
