import { Table, Row, Col, Tooltip } from 'antd'
import data from '../../../mock/trip/chargesAndPayments'
import moment from 'moment'

const Receivables = () => {
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
    width: '27%'
  },
  {
    title: 'Date',
    dataIndex: 'date',
    width: '16%',
    render: (text, record) => {
      return text ? moment(text, 'x').format('DD MMM YY') : null
    }
  },
  {
    title: 'Remarks',
    dataIndex: 'paymentComment',
    key: 'paymentComment',
    width: '37%',
    render: (text, record) => {
      const displayRecord =
      text.length > 35 ? (
        <Tooltip title={text}>
          <span>{text.slice(0, 28) + '...'}</span>
        </Tooltip>
      ) : (
        text
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
      <Table
        dataSource={data.loadCustomerCharge}
        columns={customerChargeColumns}
        pagination={false}
        size='small'
      />
      <Row className='payableHead' gutter={6}>
        <Col xs={12}><b>Receipts</b></Col>
        <Col xs={12} className='text-right'>
          <b>{23000}</b>
        </Col>
      </Row>
      <Table
        columns={advanceColumn}
        scroll={{ x: '450' }}
        dataSource={data.loadCustomerPayment}
        pagination={false}
        size='small'
      />
    </>
  )
}

export default Receivables
