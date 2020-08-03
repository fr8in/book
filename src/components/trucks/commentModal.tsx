import {useState} from "react";
import { Modal, Button, Input, message } from "antd";
import { gql, useMutation } from '@apollo/client'


  const CommentModal = (props) => {
    const { visible, onHide , id} = props
    
    const [userComment, setUserComment] = useState('')


    const INSERT_TRUCK_COMMENT_MUTATION = gql`
mutation TruckComment($description:String, $topic:String, $truck_id: Int, $created_by:String ) {
  insert_truck_comment(objects: {description: $description, truck_id: $truck_id, topic: $topic, created_by: $created_by}) {
    returning {
      id
      description
      truck_id
    }
  }
}
`

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
  console.log('id',id)
  insertComment({
    variables: {
      truck_id : id,
      created_by: 'shilpa@fr8.in',
      description: userComment,
      topic: 'text'
    }
  })
}

    return (
      <> 
       <Modal
      title="Add Comment"
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      footer={[
        <Button onClick={onSubmit} type="primary"> Submit </Button>
       ]}
      >
      <p><label>Comment</label></p>  
          <Input onChange={handleChange} placeholder="Enter Comments" />
        </Modal>
      </>
    );
  }


export default CommentModal;