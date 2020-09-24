import { useState } from 'react'
import { Row, Button, message, Divider } from 'antd'
import LabelAndData from '../common/labelAndData'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'

const CANCEL_AP = gql`
mutation cancel_ap($trip_id: Int!){
  cancel_ap(trip_id: $trip_id){
    success
    message
  }
}`

const CANCEL_AR = gql`mutation cancel_ar($trip_id: Int!){
  cancel_ar(trip_id: $trip_id){
    success
    message
  }
}`

const InvoiceDetail = (props) => {
  const { ap, ar, trip_id } = props
  const [disableAR, setDisableAR] = useState(false)
  const [disableAP, setDisableAP] = useState(false)

  const [cancel_ap] = useMutation(
    CANCEL_AP,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        setDisableAP(false)
        const success = get(data, 'cancel_ap.success', null)
        const message = get(data, 'cancel_ap.message', null)
        if (success) {
          message.success(message || 'Cancelled!')
        } else (message.error(message))
      }
    }
  )
  const [cancel_ar] = useMutation(
    CANCEL_AR,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        setDisableAR(false)
        const success = get(data, 'cancel_ar.success', null)
        const message = get(data, 'cancel_ar.message', null)
        if (success) {
          message.success(message || 'Cancelled!')
        } else (message.error(message))
      }
    }
  )

  const onAPCancel = () => {
    setDisableAP(true)
    cancel_ap({
      variables: { trip_id: parseInt(trip_id) }
    })
  }

  const onARCancel = () => {
    setDisableAR(true)
    cancel_ar({
      variables: { trip_id: parseInt(trip_id) }
    })
  }

  return (
    <>
      <Row>
        <LabelAndData
          label={<p className='mb5 h5 text-body'>{`Partner (AP: ${ap})`}</p>}
          data={<Button danger disabled={ar} loading={disableAP} onClick={onAPCancel}>AP cancel</Button>}
        />
        <LabelAndData
          label={<p className='mb5 h5 text-body'>{`Customer (AR: ${ar})`}</p>}
          data={<Button danger loading={disableAR} onClick={onARCancel}>AR cancel</Button>}
        />
      </Row>
      <Divider />
      <Row>
        <h4>Comment : </h4>
      </Row>
    </>
  )
}

export default InvoiceDetail
