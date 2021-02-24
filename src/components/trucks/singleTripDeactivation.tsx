import { useState,useContext } from 'react'
import { Row, Button, Input, message, Col, Modal, Form } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util' 

const UPDATE_SINGLE_TRIP_MUTATION = gql`
mutation single_trip($id:Int,$single_trip:Boolean,$description:String, $topic:String,$updated_by:String){
  insert_truck_comment(objects:{truck_id:$id,topic:$topic,description:$description,created_by:$updated_by})
     {
       returning
       {
         id
       }
     }
 update_truck(_set: {single_trip:$single_trip}, where: {id: {_eq:$id}}) {
   returning {
     id
   }
 }
}
`
const SingleTripDeactivation = (props) => {
  const { truck_info,onHide,visible,checked} = props
  const [disableButton, setDisableButton] = useState(false)
 
  const { topic } = u
  const context = useContext(userContext)
 



  const [updateSingleTrip] = useMutation(
    UPDATE_SINGLE_TRIP_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!') 
    onHide()}
    }
  )

 

  const onSubmit = (form) => {
    updateSingleTrip({
      variables: {
       id:truck_info.id,
       single_trip: checked  ? true : false,
       topic:  checked  ? topic.single_trip_deactivation_enable  :  topic.single_trip_deactivation_disable,
       description:form.comment,
       updated_by: context.email
      }
    })
  }


  return (
    <>
      <Modal
        title='Add Comment'
        visible={visible}
        onCancel={onHide}
        footer={[]}
      >
        <Form onFinish={onSubmit}>
          <Row gutter={10} className='mb10'>
            <Col flex='auto'>
              <Form.Item name='comment'>
                <Input
                  placeholder='Please Enter Comments......'
                />
              </Form.Item>
            </Col>
            <Col flex='80px'>
              <Form.Item>
                <Button type='primary' loading={disableButton} htmlType='submit'>Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default SingleTripDeactivation
