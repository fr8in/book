
import { useState, useContext } from 'react'
import { Modal, Button, message, Row } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import sumBy from 'lodash/sumBy'

const DELETE_PO_QUERY = gql`
query delete_po($id: Int) {
  trip(where: {id: {_eq: $id}}) {
    id
    trip_payments {
      amount
      mode
    }
    trip_receipts {
      amount
      mode
    }
  }
}
`
const TOKEN = gql`query getToken($ref_id:Int!){
  token(process:"CANCEL_TRIP_ADVANCE",ref_id:$ref_id)
}`

const PO_DELETE = gql`
mutation po_cancel($trip_id:Int!,$created_by:String!,$token:String!){
  cancel_po(trip_id:$trip_id,created_by:$created_by,token:$token){
    description
    status
  }
}`

const DeletePO = (props) => {
  const { visible, onHide, trip_info } = props
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  console.log('trip_info', trip_info)

  const { loading, error, data } = useQuery(
    DELETE_PO_QUERY,
    {
      variables: { id: trip_info.id }
    }
  )

  const { loading: token_loading, error: token_error, data: token_data } = useQuery(
    TOKEN,
    {
      variables: { ref_id: trip_info.id }
    }
  )


  let _data = {}
  if (!loading) {
    _data = data
  }
  const trip = get(_data, 'trip[0]', [])
  const trip_payments = get(trip, 'trip_payments', null)
  const trip_receipts = get(trip, 'trip_receipts', null)
  const partner_payments = trip_payments ? trip_payments.filter(payment => payment.mode === 'Wallet') : []

  const customer_cash = trip_receipts ? trip_receipts.filter(receipt => receipt.mode === 'Cash') : []
  const customer_cash_amount = sumBy(customer_cash, 'amount')
  const customer_other_payment = trip_receipts ? trip_receipts.filter(receipt => receipt.mode !== 'Cash') : []
  const customer_other_payment_amount = sumBy(customer_other_payment, 'amount')
  const partner_payment_amount = sumBy(partner_payments, 'amount')

  let _token_data = {}
  if (!token_loading) {
    _token_data = get(token_data, 'token', null)
  }
  console.log("_token_data", _token_data)
  const [delete_po] = useMutation(
    PO_DELETE,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted(data) {
        setDisableButton(false)
        const status = get(data, 'cancel_po.status', null)
        const description = get(data, 'cancel_po.description', null)
        if (status === 'OK') {
          message.success(description || 'Trip Cancelled!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  const onPoDelete = () => {
    setDisableButton(true)
    delete_po({
      variables: {
        trip_id: parseInt(trip_info.id, 10),
        created_by: context.email,
        token: _token_data
      }
    })
  }
  return (
    <>
      {
        trip_info.loaded === 'Yes' ?
          <Modal
            title='Cancel PO'
            visible={visible}
            onCancel={onHide}
            footer={[
              <Button key='back' onClick={onHide}>No</Button>,
              <Button key='submit' type='primary' onClick={onPoDelete} loading={disableButton}>Yes</Button>
            ]}
          >
            <h3> Below payments will be reversed </h3>
            <Row> {`Customer To Partner: ${customer_cash_amount}`}  </Row>
            <Row> {`Customer To FR8: ${customer_other_payment_amount}`}  </Row>
            <Row> {`FR8 To Partner: ${partner_payment_amount}`}  </Row>
          </Modal>
          :
          <Modal
            title='Delete PO'
            visible={visible}
            onCancel={onHide}
            footer={[
              <Button key='back' onClick={onHide}>No</Button>,
              <Button key='submit' type='primary' onClick={onPoDelete} loading={disableButton}>Yes</Button>
            ]}
          >
            Are you sure to Delete PO?
          </Modal>
      }
    </>
  )
}

export default DeletePO
