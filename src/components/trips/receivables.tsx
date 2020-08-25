import { Table, Row, Col, Tooltip } from 'antd'
//  import data from '../../../mock/trip/chargesAndPayments'
import moment from 'moment'
import { gql, useQuery} from '@apollo/client'
import _ from 'lodash'


const CUSTOMER_RECEIVABLES = gql`
query customer ($id: Int!){
  trip(where: {id: {_eq: $id}}) {
    customer_receivables {
      id
      trip_id
      name
      amount
    }
    customer_receipts {
      trip_id
      mode
      amount
      date
    }
  }
}
`
const Receivables = (props) => {
  const {trip_id} = props
  const { loading, error, data } = useQuery(
    CUSTOMER_RECEIVABLES,
    {
      variables: {id: trip_id},
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('trips error', error)

  var trip = []
  if (!loading) {
     trip = data && data.trip
  }
  
   const trip_info = trip[0] ? trip[0] : { name: 'ID does not exist' }
  console.log('trip_info', trip_info)
  
  const receipts = _.sumBy(trip_info.customer_receipts, 'amount');
console.log('receipts',receipts)

const receivables = _.sumBy(trip_info.customer_receivables, 'amount');
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
    dataIndex: 'date',
    width: '16%',
    render: (text, record) => {
      return (record.date) ? moment(record.date).format('DD MMM YYYY') : null
    }
  },
  {
      title: 'Remarks',
      dataIndex: 'paymentComment',
      key: 'paymentComment',
      width: '37%',
      // render: (text, record) => {
      //   const displayRecord =
      //   text.length > 35 ? (
      //     <Tooltip title={text}>
      //       <span>{text.slice(0, 28) + '...'}</span>
      //     </Tooltip>
      //   ) : (
      //     text
      //   )
      //   return displayRecord
      // }
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
        dataSource={trip_info.customer_receivables}
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
        dataSource={trip_info.customer_receipts}
        pagination={false}
        size='small'
      />
    </>
  )
}

export default Receivables
