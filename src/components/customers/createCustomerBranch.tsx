import { Row, Col, Modal, Button, Input, Select, Form, message } from 'antd'
import { useMutation, gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import CitySelect from '../common/citySelect'
import get from 'lodash/get'

const CUSTOMER_BRANCH_QUERY = gql`
  query customer_branch{
    state{
      id
      name
    }
  }
`
const INSERT_CUSTOMER_BRANCH_MUTATION = gql`
mutation customer_branch_insert($address: String,$id:Int ,$branch_name: String, $mobile: String, $name: String, $pincode: Int, $state_id: Int,$state:String, $city_id: Int,$city:String) {
  insert_customer_branch(objects: {customer_id:$id,address: $address, branch_name: $branch_name, mobile: $mobile, name: $name, pincode: $pincode,state_id: $state_id,state:$state,city_id: $city_id,city:$city}) {
    returning {
      customer_id
      state
    }
  }
}
`
const UPDATE_CUSTOMER_BRANCH_MUTATION = gql`
mutation customer_branch_update($address: String, $id: Int!, $branch_name: String, $mobile: String, $name: String, $pincode: Int, $state_id: Int,$state:String, $city_id: Int,$city:String) {
  update_customer_branch(_set: {address: $address, branch_name: $branch_name, city_id: $city_id,city:$city, mobile: $mobile, name: $name, pincode: $pincode, state_id: $state_id,state:$state}, where: { id: {_eq:  $id}}) {
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
  const initial = { city_id: null, state_name: null }
  const [obj, setObj] = useState(initial)

  const { loading, error, data } = useQuery(
    CUSTOMER_BRANCH_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('createCustomerBranch error', error)

  const [insertCustomerBranch] = useMutation(
    INSERT_CUSTOMER_BRANCH_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        setObj(initial)
      }
    }
  )

  const [updateCustomerBranch] = useMutation(
    UPDATE_CUSTOMER_BRANCH_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        setObj(initial)
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
      updateCustomerBranch({
        variables: {
          city_id: obj.city_id,
          city: form.city.split(',')[0],
          id: customerbranches.id,
          mobile: form.mobile,
          name: form.name,
          address: form.address,
          pincode: form.pincode,
          state_id: form.state_id,
          state: obj.state_name,
          branch_name: form.branch_name
        }
      })
    } else {
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
          branch_name: form.branch_name
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
                    initialValue={get(customerbranches, 'city', null)}
                    onChange={onCityChange}
                  />
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label='State'
                    name='state_id'
                    initialValue={get(customerbranches, 'state_id', null)}
                    rules={[{ required: true, message: 'State is required field' }]}
                  >
                    <Select onChange={onStateChange} options={StateList} />
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
                    <Input placeholder='Contact Number' />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify='end'>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>Save</Button>
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
