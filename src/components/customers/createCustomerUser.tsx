import { useState } from 'react'
import { Row, Col, Modal, Button, Input, Select, Form, message } from 'antd'
// import { OperatingCities } from '../../../mock/customer/createCustomerUserMock'
import { useMutation, gql, useQuery } from '@apollo/client'
import CitySelect from '../common/citySelect'

const CUSTOMER_USERS_SUBSCRIPTION = gql`
  query customer{
    branch{
      id
      name
    }
  }
`
const INSERT_CUSTOMER_USERS_MUTATION = gql`
mutation CustomeruserInsert($name:String,$mobile:String,$email:String,$customer_id:Int,) {
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
  const initial = { city_id: null }
  const [obj, setObj] = useState(initial)

  const { loading, error, data } = useQuery(
    CUSTOMER_USERS_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('createCustomerUser error', error)

  const [insertcustomerUser] = useMutation(
    INSERT_CUSTOMER_USERS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        setObj(initial)
      }
    }
  )

  var branch = []
  if (!loading) {
    branch = data.branch
  }

  const branchList = branch.map((data) => {
    return { value: data.id, label: data.name }
  })

  function handleChange (value) {
    console.log(`selected ${value}`)
  }
  const onCityChange = (city_id) => {
    setObj({ ...obj, city_id: city_id })
  }

  const onAddUser = (form) => {
    insertcustomerUser({
      variables: {
        city_id: obj.city_id,
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
            <Row gutter={6}>
              <Col xs={12}>
                <Form.Item>
                  <Select defaultValue='User Branch' onChange={handleChange} options={branchList} />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <CitySelect
                  onChange={onCityChange}
                />
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
