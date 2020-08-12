import { useState } from 'react'
import { Modal, Button,Input , message} from 'antd'
import { gql, useMutation } from '@apollo/client'

const INSERT_TRUCK_REJECT_MUTATION = gql`
mutation truckReject ($description:String, $topic:String, $truck_id: Int, $created_by_id:Int, $truck_status_id:Int,$id:Int! ){
  insert_truck_comment(objects: {truck_id:$truck_id, topic: $topic, description: $description, created_by_id: $created_by_id}) {
    returning {
      id
    }
  }
  update_truck_by_pk(pk_columns: {id: $id}, _set: {truck_status_id:$truck_status_id}) {
    id
  }
}
`

const TruckReject = (props) => {
  const { visible, onHide ,truck_id } = props

  const [rejectComment, setRejectComment] = useState('')

  
  const [insertComment] = useMutation(
    INSERT_TRUCK_REJECT_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )
  const handleChange = (e) => {
    setRejectComment(e.target.value)
  }
  console.log('rejectComment', rejectComment)

  const onSubmit = () => {
    console.log("truck_id",truck_id)
    insertComment({
      variables: {
        truck_id: truck_id,
        created_by_id: 1,
        description: rejectComment,
        topic: 'text',
        truck_status_id: 7,
        id:truck_id
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
        <Input placeholder='Enter Reject Reason'  onChange={handleChange}/>
      </Modal>
    </>
  )
}

export default TruckReject
