import { Table, Row, Col, Tooltip } from 'antd'
//  import data from '../../../mock/trip/chargesAndPayments'
import moment from 'moment'
import { gql, useQuery} from '@apollo/client'
import _ from 'lodash'

const Receivables = (props) => {
  const {trip_pay} = props
  
  const receipts = _.sumBy(trip_pay.trip_receipts, 'amount');
console.log('receipts',receipts)

const receivables = _.sumBy(trip_pay.trip_receivables, 'amount');
console.log('receivables',receivables)

  const customerChargeColumns = [
    {
      title: 'Charges',
      dataIndex: 'name'
    },
    {
      title: <div className='text-right'>Amount</div>,
      dataIndex: 'amount',
      render: (text, record) => {
        return text
          ? <div className='text-right'> {text ? text.toFixed(2) : 0}</div>
          : <div className='text-right'>0</div>
      }
    }
  ]
  const advanceColumn = [{
    title: 'Mode',
    dataIndex: 'mode',
    width: '27%',
    render: (text,record) => {
      return (record.mode)
    }
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    width: '16%',
    render: (text, record) => {
      return (record.created_at) ? moment(record.created_at).format('DD MMM YYYY') : null
    }
  },
  {
      title: 'Remarks',
      dataIndex: 'paymentComment',
      key: 'paymentComment',
      width: '37%',
      render: (text, record) => {
        const displayRecord =
        record.comment.length > 35 ? (
          <Tooltip title={record.comment}>
            <span>{record.comment.slice(0, 28) + '...'}</span>
          </Tooltip>
        ) : (
          record.comment
        )
        return displayRecord
      }
    },
  {
    title: <div className='text-right'> Amount</div>,
    dataIndex: 'amount',
    width: '20%',
    render: (text, record) => {
      return text
        ? <div className='text-right'> {text ? text.toFixed(2) : 0}</div>
        : <div className='text-right'>0</div>
    }
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
