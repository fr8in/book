
import { useState, useContext } from 'react'
import { Modal, Button, message, Row} from 'antd'
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
const PO_DELETE = gql`
mutation po_cancel($trip_id:Int!,$created_by:String!){
  cancel_po(trip_id:$trip_id,created_by:$created_by){
    description
    status
  }
}`

const DeletePO = (props) => {
  const { visible, onHide, trip_info } = props
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
console.log('trip_info',trip_info)

  const { loading, error, data } = useQuery(
    DELETE_PO_QUERY,
    {
      variables: { id: trip_info.id }
    }
  )
  console.log('deletePO Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }
  const trip = get(_data, 'trip[0]', [])
  const trip_payments = get(trip, 'trip_payments[0].mode', null)
  const trip_receipts = get(trip, 'trip_receipts[0].mode', null)
  const trip_amount = get(trip, 'trip_receipts[0].amount', null)
  const payments = trip_payments === 'Wallet' ? sumBy(trip.trip_payments, 'amount') : 0
  

  const [delete_po] = useMutation(
    PO_DELETE,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
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
        created_by: context.email
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
            <Row> {`Customer To Partner: ${trip_receipts === "Cash" ? trip_amount : 0}`}  </Row>
            <Row> {`Customer To FR8: ${trip_receipts === "Payment Gateway" ? trip_amount : 0}`}  </Row>
            <Row> {`FR8 To Partner: ${payments}`}  </Row>
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
