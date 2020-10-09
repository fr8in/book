import { Row, Col } from 'antd'
import AdvanceBooking from './advanceBooking'
import CustomerPayments from './customerPayments'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import FinalBooking from './finalBooking'
import AdditionalInvoiceBooking from './additionalInvoiceBooking'

const TRIP_CUSTOMER_PENDING_PAYMENTS = gql`
query customerPaymentData($trip_id: Int!) {
    trip_sap_customer_advance_pending(trip_id: $trip_id) {
      trip_id
      cardCode
      base_Advance_DocNum
      base_Advance_DocEntry
      amount
      received
      pending
    }
    trip_sap_customer_invoice_pending(trip_id: $trip_id) {
      trip_id
      cardCode
      status
      amount
      received
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
      doctype
      invoicetype
    }
  }`
  const TRIP_CUSTOMER = gql`
  query TripReceivable($trip_id:Int){
    accounting_trip_receivable_summary(where:{trip_id:{_eq:$trip_id}}){
      amount
      trip_id
    }
  }
  `
const CustomerPaymentsContainer = (props) => {
  const { trip_id, status, cardcode, mamul, price,walletcode,wallet_balance,bank,customer_id,status_id } = props
  const initial = { adv_visible: false, final_visible: false, title: null, adv_data: null, final_data: null, add_inv_visible: false, add_inv_data: null }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  console.log('id',trip_id)

  const { loading, error, data } = useQuery(
    TRIP_CUSTOMER_PENDING_PAYMENTS,
    {
      variables: { trip_id:trip_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('CustomerPaymentsContainer Error', error)
  const { loading:s_loading, error:s_error, data:s_data } = useQuery(
    TRIP_CUSTOMER,
    {
      variables: { trip_id:trip_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  
  let _data = {}
  if (!loading) {
    _data = data
  }

  let trip_data = {}
  if (!s_loading) {
    trip_data = s_data
  }

  console.log('CustomerPaymentsContainer data', trip_data)

  // const advance_pending = get(_data, 'trip_sap_customer_advance_pending', [])
  // const invoice_pending = get(_data, 'trip_sap_customer_invoice_pending', [])
  const balance_pending = get(_data, 'trip_sap_customer_balance_pending', [])
  const amount=get(trip_data, 'accounting_trip_receivable_summary[0].amount', [])
  
  const pending_data = [
    {amount: bank, received: amount, balance: (bank - amount)}
  ]
  const onFinalShow = (record) => {
    if (record && record.doctype === 'S') {
      handleShow('add_inv_visible', 'Final', 'add_inv_data', record)
    } else {
      handleShow('final_visible', 'Final', 'final_data', record)
    }
  }
  return (
    <>
    {
    (balance_pending) && status_id === 12 ?
     <Row>
          <Col xs={24} className='payableHead'><b>Pending Payments</b></Col>
          <Col xs={24}>
            <CustomerPayments
              dataSource={pending_data}
              type_name='Final'
              onShow={onFinalShow}
             amount={amount}
             bank={bank}
            />
          </Col>
        </Row>:
        <Row>
          <Col xs={24} className='payableHead'><b>Advance Payments</b></Col>
          <Col xs={24}>
            <CustomerPayments
              dataSource={balance_pending}
              type_name='Advance'
              onShow={() => handleShow('adv_visible', 'Advance', 'adv_data', balance_pending[0])}
            />
          </Col>
        </Row>
        }

      {/*
      TODO:Comment by sanjay -- should be removed - always advance pending
      {!isEmpty(invoice_pending) &&
        <Row>
          <Col xs={24} className='payableHead'><b>Invoice Pending Payments</b></Col>
          <Col xs={24}>
            <CustomerPayments
              dataSource={invoice_pending}
              type_name='Invoice'
              onShow={() => handleShow('adv_visible', 'Invoice', 'adv_data', invoice_pending[0])}
              bank={bank}
            />
          </Col>
        </Row>} */}

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
          walletcode={walletcode}
          wallet_balance={wallet_balance}
          customer_id={customer_id}
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
          walletcode={walletcode}
          wallet_balance={wallet_balance}
          customer_id={customer_id}
        />}
      {object.add_inv_visible &&
        <AdditionalInvoiceBooking
          visible={object.add_inv_visible}
          pending_data={object.add_inv_data}
          onHide={handleHide}
          cardcode={cardcode}
          mamul={mamul}
          price={price}
          trip_id={trip_id}
          walletcode={walletcode}
          wallet_balance={wallet_balance}
          customer_id={customer_id}
        />}
    </>
  )
}

export default CustomerPaymentsContainer


