
import { Row, Col, Modal, Button, Input, Form, message } from 'antd'
import { useMutation, gql } from '@apollo/client'
import { useState,useContext } from 'react'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const INSERT_CUSTOMER_USERS_MUTATION = gql`
mutation customer_user_insert($description: String, $topic: String, $customer_id: Int, $created_by: String,$name:String,$mobile:String,$email:String,$id:Int) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  insert_customer_user(
    objects: {
      name: $name, 
      mobile: $mobile,
      email:$email,
      customer_id: $id
    }
  ) {
    returning {
      customer_id
      mobile
    }
  }
}
`

const CreateCustomerUser = (props) => {
  const { visible, onHide, customer } = props
  const context = useContext(userContext)
  const { topic } = u

  const [disableButton, setDisableButton] = useState(false)

  const [insertcustomerUser] = useMutation(
    INSERT_CUSTOMER_USERS_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const onAddUser = (form) => {
    setDisableButton(true)
    insertcustomerUser({
      variables: {
        customer_id: customer,
        mobile: form.mobile,
        email: `${form.mobile}.customer@fr8.in`,
        name: form.name,
        created_by: context.email,
        description:`${topic.customer_user} inserted by ${context.email}`,
        topic:topic.customer_user,
        id: customer
      }
    })
  }

  return (
    <Modal
      title='Add User'
      visible={visible}
      onCancel={onHide}
      style={{ top: 20 }}
      footer={null}
    >
      <Row>
        <Col xs={24}>
          <Form layout='vertical' onFinish={onAddUser}>
            <Form.Item name='name'>
              <Input placeholder='Name' />
            </Form.Item>
            <Form.Item name='mobile'>
              <Input placeholder='Mobile No' />
            </Form.Item>
            <Form.Item name='email'>
              <Input placeholder='E-Mail' />
            </Form.Item>
            <Row justify='end'>
              <Form.Item>
                <Button type='primary' loading={disableButton} htmlType='submit'>Save</Button>
              </Form.Item>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default CreateCustomerUser
