import { useEffect } from 'react'
import { Row, Col } from 'antd'
import AdvanceBooking from './advanceBooking'
import CustomerPayments from './customerPayments'
import { gql, useQuery, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import FinalBooking from './finalBooking'
import AdditionalInvoiceBooking from './additionalInvoiceBooking'

const TRIP_CUSTOMER_PENDING_PAYMENTS = gql`
query customerPaymentData($trip_id: Int!) {
    trip_sap_customer_balance_pending(trip_id: $trip_id) {
      trip_id
      cardCode
      docentry
      invoiced
      received
      balance
      doctype
      invoicetype
    }
  }`
const TRIP_CUSTOMER = gql`
  subscription trip_receipt_summary($trip_id:Int){
    accounting_trip_receipt_summary(where:{trip_id:{_eq:$trip_id}}){
      amount
      trip_id
    }
  }
  `
const CustomerPaymentsContainer = (props) => {
  const { trip_info, trip_onHold, creditNoteRefetch, setCreditNoteRefetch } = props

  const trip_id = get(trip_info, 'id', null)
  const status = get(trip_info, 'trip_status.name', null)
  const cardcode = get(trip_info, 'customer.cardcode', null)
  const mamul = get(trip_info, 'mamul', 0)
  const price = get(trip_info, 'partner_price', 0)
  const walletcode = get(trip_info, 'customer.walletcode', null)
  const wallet_balance = get(trip_info, 'customer.customer_accounting.wallet_balance', null)
  const customer_id = get(trip_info, 'customer.id', null)
  const bank = get(trip_info, 'bank', 0)
  const loaded = get(trip_info, 'loaded', null)
  const lock = get(trip_info, 'transaction_lock', null)
  const customer_price = get(trip_info, 'customer_price', 0)

  const initial = { adv_visible: false, final_visible: false, title: null, adv_data: null, final_data: null, add_inv_visible: false, add_inv_data: null }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { loading, error, data, refetch } = useQuery(
    TRIP_CUSTOMER_PENDING_PAYMENTS,
    {
      variables: { trip_id: trip_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('CustomerPaymentsContainer Error', error)
  const { loading: s_loading, error: s_error, data: s_data } = useSubscription(
    TRIP_CUSTOMER,
    {
      variables: { trip_id: trip_id }
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

  const balance_pending = get(_data, 'trip_sap_customer_balance_pending', [])
  const received = get(trip_data, 'accounting_trip_receipt_summary[0].amount', 0)
  const trip_price = customer_price - mamul

  const advance_pending_data = [
    { docentry: 1, amount: trip_price, received: received, balance: (trip_price - received) }
  ]
  const onFinalShow = (record) => {
    if (record && record.doctype === 'S') {
      handleShow('add_inv_visible', 'Additional', 'add_inv_data', record)
    } else {
      handleShow('final_visible', 'Final', 'final_data', record)
    }
  }

  useEffect(() => {
    if (creditNoteRefetch) {
      refetch()
      setCreditNoteRefetch(false)
    }
  }, [creditNoteRefetch])

  return (
    <>
      {(status === 'Invoiced' || status === 'Paid') ? (
        <Row>
          <Col xs={24} className='payableHead'><b>Pending Payments</b></Col>
          <Col xs={24}>
            <CustomerPayments
              dataSource={balance_pending}
              onShow={onFinalShow}
              lock={lock}
            />
          </Col>
        </Row>)
        : (status === 'Recieved' || status === 'Closed') ? (
          <div className='payableHead'>
            <h4 className='text-center'>100% payment recieved from customer</h4>
          </div>)
          : (
            <Row>
              <Col xs={24} className='payableHead'><b>Advance Payments</b></Col>
              <Col xs={24}>
                <CustomerPayments
                  dataSource={advance_pending_data}
                  type_name='Advance'
                  onShow={() => handleShow('adv_visible', 'Advance', 'adv_data', advance_pending_data[0])}
                  lock={lock}
                />
              </Col>
            </Row>
          )}

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
          loaded={loaded}
          refetch={refetch}
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
          trip_onHold={trip_onHold}
          refetch={refetch}
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
          refetch={refetch}
        />}
    </>
  )
}

export default CustomerPaymentsContainer
