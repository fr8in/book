
import { useState, useContext } from 'react'
import { Modal, Button, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const PO_DELETE = gql`
mutation po_cancel($trip_id:Int!,$created_by:String!){
  cancel_po(trip_id:$trip_id,created_by:$created_by){
    description
    status
  }
}`

const DeletePO = (props) => {
  const { visible, onHide, trip_id } = props
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

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
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  const onPoDelete = () => {
    setDisableButton(true)
    delete_po({
      variables: {
        trip_id: parseInt(trip_id, 10),
        created_by: context.email
      }
    })
  }
  return (
    <>
      <Modal
        title='Delete PO'
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button key='back' onClick={onHide} loading={disableButton}>No</Button>,
          <Button key='submit' type='primary' onClick={onPoDelete}>Yes</Button>
        ]}
      >
         Are you sure to Delete PO?
      </Modal>
    </>
  )
}

export default DeletePO
