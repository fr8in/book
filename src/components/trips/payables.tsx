import { Table, Row, Col } from 'antd'
//import data from '../../../mock/trip/chargesAndPayments'
import moment from 'moment'
import _ from 'lodash'

const Payables = (props) => {
  const {trip_pay} =props

  console.log('trip_pay',trip_pay)

const payments = _.sumBy(trip_pay.trip_partner_payment, 'amount');
console.log('payment',payments)
 
  const payablesColumn  = [
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
  const paymentColumn = [{
    title: 'Mode',
    key: 'mode',
    width: '40%',
    render: (text,record) => {
      return (record.mode)
    }
  },
  {
    title: 'Date',
    key: 'date',
    width: '30%',
    render: (text, record) => {
      return (record.date) ? moment(record.date).format('DD MMM YYYY') : null
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
        columns={payablesColumn}
        pagination={false}
        size='small'
      />
      <Row className='payableHead' gutter={6}>
        <Col xs={12}><b>Payments</b></Col>
        <Col xs={12} className='text-right'>
          <b>{payments}</b>
        </Col>
      </Row>
      <Table
        columns={paymentColumn}
        dataSource={trip_pay.trip_partner_payment}
        scroll={{ x: '300' }}
        pagination={false}
        size='small'
      />
    </>
  )
}

export default Payables
