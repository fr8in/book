import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import { Modal, Button, Row, Form, Select, Col, Input, message } from 'antd'
import CitySelect from '../common/citySelect'
import { gql, useQuery, useMutation } from '@apollo/client'
import get from 'lodash/get'

const STATE_TYPE_EMP_LIST = gql`
query region_state_type_emp_list{
  state{
    id
    name
  }
  customer_type{
    id
    name
  }
  employee(where:{active: {_eq: 1}}){
    id
    email
  }
}`

const CREATE_CARDCODE = gql`
mutation create_customer_cardcode(
  $id: Int!,
  $cardcode:String
  $name: String!,
  $customer_type_id: Int!,
  $onboarded_by_id: Int!,
  $payment_manager_id: Int!,
  $mamul: Int!,
  $updated_by: String!,
  $city_id: Int!,
  $emp_name: String!,
  $address: String!,
  $state: String!,
  $state_id: Int!,
  $city: String!,
  $pincode: String!
) {
  create_customer_cardcode( 
    id: $id, 
    cardcode: $cardcode,
    name: $name,
    customer_type_id: $customer_type_id, 
    onboarded_by_id: $onboarded_by_id,
    payment_manager_id: $payment_manager_id, 
    mamul: $mamul, 
    updated_by: $updated_by, 
    city_id: $city_id, 
    customer_office: {
      name: $emp_name, 
      branch_name: "Head Office", 
      address: $address, 
      state: $state, 
      state_id: $state_id, 
      city: $city, 
      pincode: $pincode
    }) {
    status
    description
  }
}`

const BranchCreation = (props) => {
  const { visible, onHide, customer_data, mamul } = props
  const context = useContext(userContext)

  const initial = { city_id: null, state_name: null }
  const [obj, setObj] = useState(initial)
  const [disableButton, setDisableButton] = useState(false)
  const [form] = Form.useForm()

  const { loading, data, error } = useQuery(
    STATE_TYPE_EMP_LIST,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [create_cardcode] = useMutation(
    CREATE_CARDCODE,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        const status = get(data, 'create_customer_cardcode.status', null)
        const description = get(data, 'create_customer_cardcode.description', null)
        if (status === 'OK') {
          setDisableButton(false)
          message.success(description || 'KYC Approved!')
          onHide()
        } else {
          message.error(description)
          setDisableButton(false)
        }
      }
    }
  )


  let _data = {}
  if (!loading) {
    _data = data
  }

  const state = get(_data, 'state', [])
  const customer_type = get(_data, 'customer_type', [])
  const employee = get(_data, 'employee', [])

  const state_list = state.map((data) => {
    return { value: data.id, label: data.name }
  })
  const customer_type_list = customer_type.map((data) => {
    return { value: data.id, label: data.name }
  })
  const employee_list = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  const onSubmit = (form) => {
    setDisableButton(true)
    create_cardcode({
      variables: {
        id: customer_data.id,
        cardcode: get(customer_data, 'cardcode', null),
        name: customer_data.name,
        customer_type_id: form.customer_type,
        onboarded_by_id: form.onboardedby_id,
        payment_manager_id: form.payment_manager_id,
        mamul: parseInt(mamul),
        updated_by: context.email,
        city_id: parseInt(obj.city_id, 10),
        emp_name: form.name,
        address: form.address,
        state: obj.state_name,
        state_id: form.state_id,
        city: form.city.split(',')[0],
        pincode: form.pincode
      }
    })
  }

  const onCityChange = (city_id) => {
    setObj({ ...obj, city_id: city_id })
  }

  const onStateChange = (id, options) => {
    setObj({ ...obj, state_name: options.label })
  }

  return (
    <>
      <Modal
        visible={visible}
        title='Create Branch'
        onCancel={onHide}
        bodyStyle={{ padding: 10 }}
        width={450}
        footer={[]}
      >
        <Form onFinish={onSubmit} form={form}>
          <Row gutter={10}>
            <Col xs={24} sm={16}>
              <Form.Item name='branch_name' initialValue='Head Office'>
                <Input placeholder='Head Office' disabled value='Head Office' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item name='name' rules={[{ required: true, message: 'Name required' }]}>
                <Input placeholder='Name' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name='customer_type' rules={[{ required: true }]} initialValue={get(customer_data, 'customer_type.id', null)}>
                <Select
                  placeholder='Customer Type ....'
                  options={customer_type_list}
                  optionFilterProp='label'
                  showSearch
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name='address' rules={[{ required: true }]}>
            <Input placeholder='Address' />
          </Form.Item>
          <Row gutter={10}>
            <Col xs={24} sm={8}>
              <CitySelect onChange={onCityChange} name='city' required />
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name='state_id' rules={[{ required: true }]}>
                <Select
                  placeholder='Select State'
                  options={state_list}
                  optionFilterProp='label'
                  onChange={onStateChange}
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name='pincode' rules={[{ required: true }]}>
                <Input placeholder='Pincode' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item name='onboardedby_id' rules={[{ required: true }]}>
                <Select
                  placeholder='OnBoarded By'
                  options={employee_list}
                  optionFilterProp='label'
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name='payment_manager_id' rules={[{ required: true }]}>
                <Select
                  placeholder='Select Payment Manager'
                  options={employee_list}
                  optionFilterProp='label'
                  showSearch
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify='end'>
            <Form.Item>
              <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Create Branch & Approve</Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default BranchCreation
