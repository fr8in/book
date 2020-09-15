
import { Row, Col, Modal, Button, Input, Form, message } from 'antd'
import { useMutation, gql } from '@apollo/client'

const INSERT_CUSTOMER_USERS_MUTATION = gql`
mutation customer_user_insert($name:String,$mobile:String,$email:String,$customer_id:Int,) {
  insert_customer_user(
    objects: {
      name: $name, 
      mobile: $mobile,
      email:$email,
      customer_id: $customer_id
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

  const [insertcustomerUser] = useMutation(
    INSERT_CUSTOMER_USERS_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        message.success('Updated!!')
      }
    }
  )

  const onAddUser = (form) => {
    insertcustomerUser({
      variables: {
        customer_id: customer,
        mobile: form.mobile,
        email: `${form.mobile}.customer@fr8.in`,
        name: form.name
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
                <Button key='back' onClick={onHide}>Cancel</Button>
                <Button type='primary' htmlType='submit'>Save</Button>
              </Form.Item>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default CreateCustomerUser
