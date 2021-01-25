import { Modal, Button, Input, Row, Form, message} from 'antd'
import { gql, useMutation, } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import get from 'lodash/get'

const UPDATE_REVERSE_POD_DISPATCH = gql`
mutation ReversePodDispatch ($docket:String,$trip_id:Int,$updated_by:String,$description:String,$topic:String){
  update_trip(_set:{pod_dispatched_at:null}where:{trip_pod_dispatch:{docket:{_eq:$docket}trip_id:{_eq:$trip_id}}}){
    returning{
      id
    }
  }
  delete_trip_pod_dispatch(where:{docket:{_eq:$docket}trip_id:{_eq:$trip_id}}){
    returning{
      id
    }
  }
 insert_trip_comment(objects: {topic:$topic, description: $description, created_by: $updated_by, trip_id: $trip_id}) {
  returning {
    id
  }
}
}
`

const Reversepoddispatch = (props) => {
  const { visible, onHide } = props
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  const [form] = Form.useForm()
  
  const [updateReversepoddispatch] = useMutation(
    UPDATE_REVERSE_POD_DISPATCH,
    {
      onError (error) {
        setDisableButton(false)
         message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Reverse!!')
        onHide()
      }
    }
  )

  const onChange = (form) => {
    setDisableButton(true)
    updateReversepoddispatch({
      variables: {
        trip_id: form.trip_id,
        docket_no : form.docket_no,
        updated_by: context.email,
        description: `${form.getFieldValue('docket_no') || form.getFieldValue('trip_id') } deleted by ${context.email}`,
        topic: "Reverse Docket No"
      }
    })
  }

  return (
    <Modal
      title='Reverse POD Dispatch'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onChange}>
      <Form.Item label='Docket No' name='docket_no' >
          <Input placeholder='Enter the Docket No' />
        </Form.Item>
         <Form.Item label='Trip ID' name='trip_id' >
          <Input placeholder='Enter the Trip Id' />
        </Form.Item> 
        <Row justify='end'>
          <Button type='primary' loading={disableButton} htmlType='submit'>Reverse</Button>
        </Row>
      </Form>
    </Modal>
  )
}
export default Reversepoddispatch
