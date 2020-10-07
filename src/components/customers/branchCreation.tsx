import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'
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
  employee{
    id
    email
  }
}`

const CREATE_CARDCODE = gql`
mutation create_customer_cardcode($company_name: String!, $customer_id: Int!){
  create_customer_cardcode(company_name: $company_name, customer_id: $customer_id) {
    description
    status
  }
}`

const CREATE_CUSTOMER_BRANCH = gql`
mutation insert_customer_office(
  $name: String!
  $branch_name: String!
  $customer_id: Int!
  $address:String
  $state: String
  $state_id:Int
  $city: String
  $city_id: Int
  $pincode: Int
){
  insert_customer_office(objects:{
    name: $name,
    branch_name: $branch_name
    customer_id: $customer_id
    address: $address
    state: $state
    state_id: $state_id
    city: $city
    city_id: $city_id
    pincode: $pincode
  }){
    returning{
      id
    }
  }
}`

const UPDATE_CUSTOMER = gql`
mutation update_customer(
  $onboarded_by_id: Int
  $payment_manager_id: Int
  $customer_type_id: Int
  $mamul: Int
  $id:Int!
  $updated_by:String!) {
  update_customer(_set: {
      customer_type_id: $customer_type_id, 
      onboarded_by_id: $onboarded_by_id, 
      payment_manager_id: $payment_manager_id, 
      system_mamul: $mamul,
      status_id: 5,
      updated_by:$updated_by
    }, 
    where: {
      id: {_eq:$id}
    }) {
    returning {
      id
    }
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
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const status = get(data, 'create_customer_cardcode.status', null)
        const description = get(data, 'create_customer_cardcode.description', null)
        if (status === 'OK') {
          message.success(description || 'Cardcode created!')
          onBranchInsert()
        } else (message.error(description))
      }
    }
  )

  const [insert_customer_branch] = useMutation(
    CREATE_CUSTOMER_BRANCH,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        onCustomerUpdate()
      }
    }
  )

  const [update_customer] = useMutation(
    UPDATE_CUSTOMER,
    {
      onError (error) { 
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!')
        setDisableButton(false)
        onHide()
      }
    }
  )

  console.log('BranchCreation error', error)
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

  const onSubmit = () => {
    setDisableButton(true)
    create_cardcode({
      variables: {
        company_name: customer_data.name,
        customer_id: customer_data.id
      }
    })
  }

  const onBranchInsert = () => {
    insert_customer_branch({
      variables: {
        name: form.getFieldValue('name'),
        branch_name: form.getFieldValue('name'),
        customer_id: customer_data.id,
        address: form.getFieldValue('address'),
        state: obj.state_name,
        state_id: form.getFieldValue('state_id'),
        city: form.getFieldValue('city').split(',')[0],
        city_id: obj.city_id,
        pincode: form.getFieldValue('pincode')
      }
    })
  }

  const onCustomerUpdate = () => {
    update_customer({
      variables: {
        customer_type_id: form.getFieldValue('customer_type'),
        onboarded_by_id: form.getFieldValue('onboardedby_id'),
        payment_manager_id: form.getFieldValue('payment_manager_id'),
        mamul: parseInt(mamul),
        updated_by: context.email,
        id:customer_data.id
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
              <Form.Item name='name' rules={[{ required: true, message: 'City name required' }]}>
                <Input placeholder='City name' />
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
              <Button type='primary' loading={disableButton} htmlType='submit'>Create Branch & Approve</Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default BranchCreation
