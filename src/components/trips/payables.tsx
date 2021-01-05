
import { Table, Row, Col } from 'antd'
import moment from 'moment'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import sumBy from 'lodash/sumBy'

const TRIP_PAYABLES = gql`
subscription trip_payables($id: Int!) {
  trip(where: {id: {_eq: $id}}) {
    trip_payables(where: {type_id: {_neq: 15}}) {
      id
      name
      amount
      created_at
    }
    trip_accounting{
      invoiced_at
      onhold
      pending_payable
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


  let _data = {}
  if (!loading) {
    data.trip[0].trip_payables.sort((a,b)=> (a.amount > b.amount) ? -1 : 1)
    data.trip[0].trip_payments.sort((a,b)=> (a.amount > b.amount) ? -1 : 1)
    _data = data
  }

  const trip_pay = get(_data, 'trip[0]', [])

  const payables = sumBy(trip_pay.trip_payables, 'amount').toFixed(2)
  const payments = sumBy(trip_pay.trip_payments, 'amount').toFixed(2)
  const invoiced_at = get(trip_pay, 'trip_accounting.invoiced_at')
  const onHold = get(trip_pay, 'trip_accounting.onhold')
  const pending_payable = get(trip_pay, 'trip_accounting.pending_payable')
  const pending_payable_total = onHold + pending_payable

  const pendingPayables = [{ id: 1, name: 'On-Hold', value: onHold },
  { id: 2, name: 'Cleared', value: pending_payable }]

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
  const PendingpayablesColumn = [
    {
      title: 'Charges',
      dataIndex: 'name'
    },
    {
      title: <div className='text-right'>Amount</div>,
      dataIndex: 'value',
      className: 'text-right'
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
        <Col xs={12}><b>Payables</b></Col>
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
       {
       (invoiced_at && pending_payable) != null ?
        <>
          <Row className='payableHead' gutter={6}>
            <Col xs={12}><b>Pending Payables</b></Col>
            <Col xs={12} className='text-right'>
              <b>{pending_payable_total.toFixed(2)}</b>
            </Col>
          </Row>
          <Table
            dataSource={pendingPayables}
            columns={PendingpayablesColumn}
            pagination={false}
            size='small'
            rowKey={record => record.id}
          />
        </> : null
      }
    </>
  )
}

export default Payables
