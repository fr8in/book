import { Table, Row, Col } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import Truncate from '../common/truncate'

const Receivables = (props) => {
  const { trip_pay } = props

  const receivables = _.sumBy(trip_pay.trip_receivables, 'amount').toFixed(2)
  const receipts = _.sumBy(trip_pay.trip_receipts, 'amount').toFixed(2)

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
      />
    </>
  )
}

export default Receivables
