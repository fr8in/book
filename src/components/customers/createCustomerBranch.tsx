import { Row, Col, Modal, Button, Input, Select, Form, message } from 'antd'
import { useMutation, gql, useQuery } from '@apollo/client'
import CitySelect from '../common/citySelect'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import { useState, useContext } from 'react'

const CUSTOMER_BRANCH_QUERY = gql`
  query customer_branch_state{
    state{
      id
      name
    }
  }
`
const INSERT_CUSTOMER_BRANCH_MUTATION = gql`
mutation customer_branch_insert($description: String, $topic: String, $customer_id: Int, $created_by: String,$address: String, $id: Int!, $branch_name: String, $mobile: String, $name: String, $pincode: String, $state_id: Int,$state:String, $city_id: Int,$city:String) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  insert_customer_office(objects: {customer_id:$id,address: $address, branch_name: $branch_name, mobile: $mobile, name: $name, pincode: $pincode,state_id: $state_id,state:$state,city_id: $city_id,city:$city}) {
    returning {
      customer_id
      state
    }
  }
}
`
const UPDATE_CUSTOMER_BRANCH_MUTATION = gql`
mutation customer_branch_update($description: String, $topic: String, $customer_id: Int, $created_by: String,$address: String, $id: Int!, $branch_name: String, $mobile: String, $name: String, $pincode: String, $state_id: Int,$state:String, $city_id: Int,$city:String) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer_office(_set: {address: $address, branch_name: $branch_name, city_id: $city_id,city:$city, mobile: $mobile, name: $name, pincode: $pincode, state_id: $state_id,state:$state}, where: { id: {_eq:  $id}}) {
    returning {
      customer_id
      city 
      city_id
      state 
      state_id
      name
    }
  }
}
`

const CreateCustomerBranch = (props) => {
  const { visible, onHide, customerbranches, customer_id } = props
  const initial = { city_id: null, state_name: ((customerbranches && customerbranches.state) || null) }
  const [obj, setObj] = useState(initial)
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  const { topic } = u

  const { loading, error, data } = useQuery(
    CUSTOMER_BRANCH_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )


  const [insertCustomerBranch] = useMutation(
    INSERT_CUSTOMER_BRANCH_MUTATION,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted() {
        setDisableButton(false)
        message.success('Updated!!')
        setObj(initial)
        onHide()
      }
    }
  )

  const [updateCustomerBranch] = useMutation(
    UPDATE_CUSTOMER_BRANCH_MUTATION,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted() {
        setDisableButton(false)
        message.success('Updated!!')
        setObj(initial)
        onHide()
      }
    }
  )

  var state = []
  if (!loading) {
    state = data.state
  }

  const StateList = state.map((data) => {
    return { value: data.id, label: data.name }
  })

  const onCityChange = (city_id) => {
    setObj({ ...obj, city_id: city_id })
  }
  const onStateChange = (id, option) => {
    setObj({ ...obj, state_name: option.label })
  }

  const onAddBranch = (form) => {
    if (customerbranches) {
      setDisableButton(true)
      updateCustomerBranch({
        variables: {
          city_id: obj.city_id,
          city: form.city.split(',')[0],
          id: customerbranches.id,
          mobile: form.mobile,
          name: form.name,
          address: form.address,
          pincode: form.pincode,
          state_id: isNaN(form.state_id) ? customerbranches.state_id : form.state_id,
          state: obj.state_name,
          branch_name: form.branch_name,
          created_by: context.email,
          description: `${topic.customer_branch} updated by ${context.email}`,
          topic: topic.customer_branch,
          customer_id: customer_id
        }
      })
    } else {
      setDisableButton(true)
      insertCustomerBranch({
        variables: {
          city_id: obj.city_id,
          city: form.city.split(',')[0],
          id: customer_id,
          mobile: form.mobile,
          name: form.name,
          address: form.address,
          pincode: form.pincode,
          state_id: form.state_id,
          state: obj.state_name,
          branch_name: form.branch_name,
          created_by: context.email,
          description: `${topic.customer_branch} inserted by ${context.email}`,
          topic: topic.customer_branch,
          customer_id: customer_id
        }
      })
    }
  }

  return (
    <>
      <Modal
        title='Add/Edit Branch'
        style={{ top: 20 }}
        visible={visible}
        onCancel={onHide}
        footer={null}
      >
        <Row>
          <Col xs={24}>
            <Form layout='vertical' onFinish={onAddBranch}>
              <Form.Item name='branch_name' initialValue={get(customerbranches, 'branch_name', null)}>
                <Input placeholder='Branch Name' />
              </Form.Item>
              <Form.Item name='name' initialValue={get(customerbranches, 'name', null)}>
                <Input placeholder='Name' />
              </Form.Item>
              <Form.Item name='address' initialValue={get(customerbranches, 'address', null)}>
                <Input placeholder='Building No ,Address' />
              </Form.Item>
              <Row gutter={6}>
                <Col xs={12}>
                  <CitySelect
                    label='City'
                    name='city'
                    city={get(customerbranches, 'city', null)}
                    onChange={onCityChange}
                  />
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label='State'
                    name='state_id'
                    initialValue={get(customerbranches, 'state', null)}
                    rules={[{ required: true, message: 'State is required field' }]}
                  >
                    <Select onChange={onStateChange} options={StateList} showSearch optionFilterProp='label' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item name='pincode' initialValue={get(customerbranches, 'pincode', null)}>
                    <Input placeholder='Pin Code' />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name='mobile' initialValue={get(customerbranches, 'mobile', null)}>
                    <Input
                      placeholder='Contact Number'
                      type='number'
                      maxLength={10}
                      onInput={u.handleLengthCheck}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify='end'>
                <Form.Item>
                  <Button type='primary' htmlType='submit' loading={disableButton}>Save</Button>
                </Form.Item>
              </Row>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default CreateCustomerBranch
