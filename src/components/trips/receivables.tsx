import { useEffect } from 'react'
import { Table, Row, Col } from 'antd'
import moment from 'moment'
import Truncate from '../common/truncate'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import sumBy from 'lodash/sumBy'

const TRIP_RECEIBABLES = gql`
subscription trips_receivables($id: Int!) {
  trip(where: {id: {_eq:$id}}){
      trip_receivables {
        id
        name
        amount
        created_at
      }
      trip_receipts{
        id
        amount
        comment
        mode
        created_at
      }
      # needed for On_hold Value don't remove
      trip_payables {
      id
      name
      amount
      created_at
    }
  }
}`

const Receivables = (props) => {
  const { trip_id, setTrip_onHold } = props

  const { loading, data, error } = useSubscription(
    TRIP_RECEIBABLES,
    {
      variables: { id: trip_id }
    }
  )

  console.log('Receivables Error', error)
  let _data = {}
  if (!loading) { 
    data.trip[0].trip_receivables.sort((a,b)=> (a.amount > b.amount) ? -1 : 1)
    data.trip[0].trip_receipts.sort((a,b)=> (a.amount > b.amount) ? -1 : 1)
    _data = data
  }

  const trip_pay = get(_data, 'trip[0]', [])

  const receivables = sumBy(trip_pay.trip_receivables, 'amount').toFixed(2)
  const receipts = sumBy(trip_pay.trip_receipts, 'amount').toFixed(2)

  const all_payables = get(trip_pay, 'trip_payables', [])
  const on_hold = !isEmpty(all_payables) && all_payables.filter(payable => payable.name === 'On-Hold')

  useEffect(() => {
    setTrip_onHold(!isEmpty(on_hold) && on_hold[0].amount)
  }, [trip_pay])

  const customerChargeColumns = [
    {
      title: 'Charges',
      dataIndex: 'name'
    },
    {
      title: <div className='text-right'>Amount</div>,
      dataIndex: 'amount',
      className: 'text-right',
      render: (text, record) => text ? text.toFixed(2) : 0
    }
  ]
  const advanceColumn = [
    {
      title: 'Mode',
      dataIndex: 'mode',
      width: '27%',
      render: (text, record) => text
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      width: '18%',
      render: (text, record) => text ? moment(text).format('DD MMM YY') : null
    },
    {
      title: 'Remarks',
      dataIndex: 'comment',
      key: 'comment',
      width: '35%',
      render: (text, record) => <Truncate data={text} length={20} />
    },
    {
      title: <div className='text-right'>Amount</div>,
      dataIndex: 'amount',
      width: '20%',
      className: 'text-right',
      render: (text, record) => text ? text.toFixed(2) : 0
    }
  ]

  return (
    <>
      <Row className='payableHead' gutter={6}>
        <Col xs={12}><b>Receivables</b></Col>
        <Col xs={12} className='text-right'>
          <b>{receivables}</b>
        </Col>
      </Row>
      <Table
        dataSource={trip_pay.trip_receivables}
        columns={customerChargeColumns}
        pagination={false}
        size='small'
        rowKey={record => record.id}
      />
      <Row className='payableHead' gutter={6}>
        <Col xs={12}><b>Receipts</b></Col>
        <Col xs={12} className='text-right'>
          <b>{receipts}</b>
        </Col>
      </Row>
      <Table
        columns={advanceColumn}
        scroll={{ x: '450' }}
        dataSource={trip_pay.trip_receipts}
        pagination={false}
        size='small'
        rowKey={record => record.id}
      />
    </>
  )
}

export default Receivables
