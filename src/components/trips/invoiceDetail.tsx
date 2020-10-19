import { useState } from 'react'
import { Row, Button, message } from 'antd'
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
  const { ap, ar, trip_id, edit_access, lock } = props
  const [disableAR, setDisableAR] = useState(false)
  const [disableAP, setDisableAP] = useState(false)

  const [cancel_ap] = useMutation(
    CANCEL_AP,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        setDisableAP(false)
        const status = get(data, 'cancel_ap.success', null)
        const msg = get(data, 'cancel_ap.message', null)
        if (status) {
          message.success(msg || 'Cancelled!')
        } else (message.error(msg))
      }
    }
  )
  const [cancel_ar] = useMutation(
    CANCEL_AR,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        setDisableAR(false)
        const status = get(data, 'cancel_ar.success', null)
        const msg = get(data, 'cancel_ar.message', null)
        if (status) {
          message.success(msg || 'Cancelled!')
        } else (message.error(msg))
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
          data={edit_access ? <Button danger disabled={ar || lock} loading={disableAP} onClick={onAPCancel}>AP cancel</Button> : ''}
        />
        <LabelAndData
          label={<p className='mb5 h5 text-body'>{`Customer (AR: ${ar})`}</p>}
          data={edit_access ? <Button danger loading={disableAR} onClick={onARCancel} disabled={lock}>AR cancel</Button> : ''}
        />
      </Row>
    </>
  )
}

export default InvoiceDetail
