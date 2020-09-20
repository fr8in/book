import { Row, Col } from 'antd'
import AdvanceBooking from './advanceBooking'
import CustomerPayments from './customerPayments'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import FinalBooking from './finalBooking'

const TRIP_CUSTOMER_PENDING_PAYMENTS = gql`
query customerPaymentData($trip_id: Int!) {
  trip_sap_customer_advance_pending(trip_id: $trip_id) {
    trip_id
    cardCode
    base_Advance_DocNum
    base_Advance_DocEntry
    amount
    recevied
    pending
  }
  trip_sap_customer_invoice_pending(trip_id: $trip_id) {
    trip_id
    cardCode
    status
    amount
    recevied
    pending
  }
  trip_sap_customer_balance_pending(trip_id: $trip_id) {
    trip_id
    cardCode
    docentry
    advanceReceived
    additionalCharges
    freight
    received
    balance
  }
}`

const CustomerPaymentsContainer = (props) => {
  const { trip_id, status, cardcode, mamul, price } = props
  const initial = { adv_visible: false, final_visible: false, title: null, adv_data: null, final_data: null }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { loading, error, data } = useQuery(
    TRIP_CUSTOMER_PENDING_PAYMENTS,
    {
      variables: { trip_id: parseInt(trip_id, 10) },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CustomerPaymentsContainer Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const advance_pending = get(_data, 'trip_sap_customer_advance_pending', [])
  const invoice_pending = get(_data, 'trip_sap_customer_invoice_pending', [])
  const balance_pending = get(_data, 'trip_sap_customer_balance_pending', [])
  return (
    <>
      {!isEmpty(advance_pending) &&
        <Row>
          <Col xs={24} className='payableHead'><b>Advance Payments</b></Col>
          <Col xs={24}>
            <CustomerPayments
              dataSource={advance_pending}
              type_name='Advance'
              onShow={() => handleShow('adv_visible', 'Advance', 'adv_data', advance_pending[0])}
            />
          </Col>
        </Row>}
      {!isEmpty(invoice_pending) &&
        <Row>
          <Col xs={24} className='payableHead'><b>Invoice Pending Payments</b></Col>
          <Col xs={24}>
            <CustomerPayments
              dataSource={invoice_pending}
              type_name='Invoice'
              onShow={() => handleShow('adv_visible', 'Invoice', 'adv_data', invoice_pending[0])}
            />
          </Col>
        </Row>}
      {!isEmpty(balance_pending) &&
        <Row>
          <Col xs={24} className='payableHead'><b>Pending Payments</b></Col>
          <Col xs={24}>
            <CustomerPayments
              dataSource={balance_pending}
              type_name='Final'
              onShow={() => handleShow('final_visible', 'Final', 'final_data', balance_pending[0])}
            />
          </Col>
        </Row>}
      {(status === 'Recieved' || status === 'Closed') &&
        <div className='payableHead'>
          <h4 className='text-center'>100% payment recieved from customer</h4>
        </div>}
      {object.adv_visible &&
        <AdvanceBooking
          visible={object.adv_visible}
          title={object.title}
          pending_data={object.adv_data}
          onHide={handleHide}
          cardcode={cardcode}
          mamul={mamul}
          price={price}
          trip_id={trip_id}
        />}
      {object.final_visible &&
        <FinalBooking
          visible={object.final_visible}
          title={object.title}
          pending_data={object.final_data}
          onHide={handleHide}
          cardcode={cardcode}
          mamul={mamul}
          price={price}
          trip_id={trip_id}
        />}
    </>
  )
}

export default CustomerPaymentsContainer
