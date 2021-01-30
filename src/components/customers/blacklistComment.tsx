import { useState,useContext } from 'react'
import { Row, Button, Input, message, Col, Modal, Form } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`
mutation customer_blacklist($description: String, $topic: String, $customer_id: Int, $created_by: String,$status_id:Int,$cardcode:String,$updated_by:String!) {
    insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
      returning {
        description
      }
    }
    update_customer(_set: {status_id: $status_id,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
      returning {
        id
        status_id
      }
    }
  }
    
`

const customerStatus = {
    Blacklisted: 6,
    Active: 1
  }

const CustomerBlacklist = (props) => {
  const { customer_info,onHide,visible,blacklisted } = props
  const [disableButton, setDisableButton] = useState(false)
  const [form] = Form.useForm()
  const { topic } = u
  
  const context = useContext(userContext)
 

  const [updateStatusId] = useMutation(
    UPDATE_CUSTOMER_BLACKLIST_MUTATION,
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

 

  const onChange = (form) => {
    setDisableButton(true)
    updateStatusId({
      variables: {
        cardcode:customer_info.cardcode,
        updated_by: context.email,
        status_id: blacklisted ? customerStatus.Active : customerStatus.Blacklisted,
        created_by: context.email,
        description:form.comment,
        topic:blacklisted ? topic.customer_unblacklist : topic.customer_blacklist,
        customer_id:customer_info.id
         
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
        <Form onFinish={onChange} form={form}>
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
                <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default CustomerBlacklist
