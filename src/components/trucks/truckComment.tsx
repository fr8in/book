import { useState } from 'react'
import { Modal, Button, Input, message } from 'antd'
import { gql, useMutation } from '@apollo/client'

const INSERT_TRUCK_COMMENT_MUTATION = gql`
mutation TruckComment($description:String, $topic:String, $truck_id: Int, $created_by_id:Int ) {
  insert_truck_comment(objects: {description: $description, truck_id: $truck_id, topic: $topic, created_by_id: $created_by_id}) {
    returning {
      id
      description
      truck_id
    }
  }
}
`
const TruckComment = (props) => {
  const { visible, onHide, id, truck_status } = props
  console.log('truck_status', truck_status)

  const [userComment, setUserComment] = useState('')

  const [insertComment] = useMutation(
    INSERT_TRUCK_COMMENT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const handleChange = (e) => {
    setUserComment(e.target.value)
  }
  console.log('userComment', userComment)

  const onSubmit = () => {
    console.log('id', id)
    insertComment({
      variables: {
        truck_id: id,
        created_by_id: 1,
        description: userComment,
        topic: truck_status
      }
    })
  }

  return (
    <>
      <Modal
        title='Add Comment'
        visible={visible}
        onOk={onSubmit}
        onCancel={onHide}
        footer={[
          <Button onClick={onSubmit} type='primary' key='ok'> Submit </Button>
        ]}
      >
        <p><label>Comment</label></p>
        <Input onChange={handleChange} placeholder='Enter Comments' />
      </Modal>
    </>
  )
}

export default TruckComment
