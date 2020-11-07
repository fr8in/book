import { useState, useContext } from 'react'
import { Modal, Button, Input, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'

const INSERT_TRUCK_REJECT_MUTATION = gql`
mutation truck_reject ($description:String, $topic:String, $truck_id: Int, $created_by:String, $truck_status_id:Int,$id:Int!,$updated_by: String! ){
  insert_truck_comment(objects: {truck_id:$truck_id, topic: $topic, description: $description, created_by: $created_by}) {
    returning {
      id
    }
  }
  update_truck_by_pk(pk_columns: {id: $id}, _set: {truck_status_id:$truck_status_id,,updated_by:$updated_by}) {
    id
  }
}
`
const TruckReject = (props) => {
  const { visible, onHide, truck_id } = props

  const [rejectComment, setRejectComment] = useState('')
  const context = useContext(userContext)

  const [insertComment] = useMutation(
    INSERT_TRUCK_REJECT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        onHide()
      }
    }
  )
  const handleChange = (e) => {
    setRejectComment(e.target.value)
  }
  console.log('rejectComment', rejectComment)

  const onSubmit = () => {
    insertComment({
      variables: {
        truck_id: truck_id,
        created_by: context.email,
        description: rejectComment,
        topic: 'Truck Rejected',
        truck_status_id: 12,
        id: truck_id,
        updated_by: context.email
      }
    })
  }

  return (
    <>
      <Modal
        title='Reject Truck'
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button key='back' onClick={onHide}>Cancel</Button>,
          <Button key='submit' type='primary' onClick={onSubmit}>Ok</Button>
        ]}
      >
        <Input placeholder='Enter Reject Reason' onChange={handleChange} />
      </Modal>
    </>
  )
}

export default TruckReject
