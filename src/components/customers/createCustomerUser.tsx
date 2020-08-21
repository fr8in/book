
import { Row, Col, Modal, Button, Input, Select, Form,message } from 'antd'
import { UserBranch, OperatingCities } from '../../../mock/customer/createCustomerUserMock'
import { useMutation, gql } from '@apollo/client'

const INSERT_CUSTOMER_USERS_MUTATION = gql`
mutation CustomeruserInsert($name:String,$mobile:String,$email:String,$customer_id:Int) {
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
  const { visible, onHide,customer } = props

  const [insertcustomerUser] = useMutation(
    INSERT_CUSTOMER_USERS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  function handleChange (value) {
    console.log(`selected ${value}`)
  }

  const onAddUser = (form) => {
    insertcustomerUser({
      variables: {
        customer_id: customer.id,
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
            <Row gutter={6}>
              <Col xs={12}>
                <Form.Item>
                  <Select defaultValue='User Branch' onChange={handleChange} options={UserBranch} />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item>
                  <Select defaultValue='Enter Operating Cities' onChange={handleChange} options={OperatingCities} />
                </Form.Item>
              </Col>
            </Row>
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
