import { useState,useContext } from 'react'
import { Row, Button, Input, message, Col, Modal, Form } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const INSERT_TRUCK_REJECT_MUTATION = gql`
mutation truck_reject($description:String, $topic:String, $truck_status_id:Int,$id:Int!,$updated_by: String!,$truck_id:Int!){
    insert_truck_comment(objects:{truck_id:$truck_id,topic:$topic,description:$description,created_by:$updated_by})
      {
        returning
        {
          id
        }
      }
    update_truck_by_pk(pk_columns: {id: $id}, _set: {truck_status_id:$truck_status_id,updated_by:$updated_by}) {
      id
    }
  }
`
const TruckReject = (props) => {
  const { truck_info,onHide,visible } = props
  const [disableButton, setDisableButton] = useState(false)
  const [form] = Form.useForm()
  const { topic } = u
  const context = useContext(userContext)
 

  const [updateStatus] = useMutation(
    INSERT_TRUCK_REJECT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!') 
      onHide() }
    }
  )


  const onSubmit = (form) => {
    setDisableButton(true)
    const status_check = truck_info && truck_info.truck_status && truck_info.truck_status.name === 'Deactivated'
    updateStatus({
      variables: {
        truck_status_id: status_check ? 5 : 6,
        id: truck_info.id,
        updated_by: context.email,
        description: form.comment,
        topic:status_check ? topic.truck_activation : topic.truck_deactivation,
        truck_id: truck_info.id
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
        <Form onFinish={onSubmit} form={form}>
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
                <Button type='primary' loading={disableButton}  htmlType='submit'>Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default TruckReject
