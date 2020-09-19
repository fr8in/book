import { Table, Row, Col } from 'antd'
import moment from 'moment'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import sumBy from 'lodash/sumBy'

const TRIP_PAYABLES = gql`
subscription trip_payables($id: Int!) {
  trip(where: {id: {_eq: $id}}) {
    trip_payables {
      id
      name
      amount
      ordering
      created_at
    }
    trip_payments {
      id
      refno
      amount
      transaction_type
      mode
      created_at
    }
  }
}`

const Payables = (props) => {
  const { trip_id } = props

  const { loading, data, error } = useSubscription(
    TRIP_PAYABLES,
    {
      variables: { id: trip_id }
    }
  )

  console.log('Payables Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const trip_pay = get(_data, 'trip[0]', [])

  const payables = sumBy(trip_pay.trip_payables, 'amount').toFixed(2)
  const payments = sumBy(trip_pay.trip_payments, 'amount').toFixed(2)

  const payablesColumn = [
    {
      title: 'Charges',
      dataIndex: 'name'
    },
    {
      title: <div className='text-right'>Amount</div>,
      dataIndex: 'amount',
      className: 'text-right',
      render: (text, record) => text.toFixed(2)
    }
  ]
  const paymentColumn = [
    {
      title: 'Mode',
      dataIndex: 'mode',
      width: '40%',
      render: (text, record) => text
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      width: '30%',
      render: (text, record) => text ? moment(text).format('DD MMM YYYY') : null
    },
    {
      title: <div className='text-right'>Amount</div>,
      dataIndex: 'amount',
      width: '30%',
      className: 'text-right',
      render: (text, record) => text ? text.toFixed(2) : 0
    }
  ]
  return (
    <>
      <Row className='payableHead' gutter={6}>
        <Col xs={12}><b>Paymentable</b></Col>
        <Col xs={12} className='text-right'>
          <b>{payables}</b>
        </Col>
      </Row>
      <Table
        dataSource={trip_pay.trip_payables}
        columns={payablesColumn}
        pagination={false}
        size='small'
        rowKey={record => record.id}
      />
      <Row className='payableHead' gutter={6}>
        <Col xs={12}><b>Payments</b></Col>
        <Col xs={12} className='text-right'>
          <b>{payments}</b>
        </Col>
      </Row>
      <Table
        columns={paymentColumn}
        dataSource={trip_pay.trip_payments}
        scroll={{ x: '300' }}
        pagination={false}
        size='small'
        rowKey={record => record.id}
      />
    </>
  )
}

export default Payables
