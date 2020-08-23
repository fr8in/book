
import { Row, Col, Modal, Button, Input, Select, Form,message } from 'antd'
//  import  {State}  from '../../../mock/customer/createCustomerBranchMock'
import { useMutation, gql,useQuery } from '@apollo/client'
import {useState} from 'react'
import CitySelect from '../common/citySelect'
const { Option } = Select

const CUSTOMER_BRANCH_SUBSCRIPTION = gql`
  query customerbranch{
    state{
      id
      name
    }
  }
`
const INSERT_CUSTOMER_USERS_MUTATION = gql`
mutation CustomerBranchInsert($address: String, $branchname: String, $mobile: String, $name: String, $pincode: Int, $customer_id: Int, $state: Int,$city_id:Int) {
  insert_customer_branch(objects: {address: $address, branch_name: $branchname, mobile: $mobile, name: $name, pincode: $pincode, customer_id: $customer_id, city_id: $city_id, state_id: $state}) {
    returning {
      customer_id
      city{
        name
      }
      state{
        name
      }
    }
  }
}

`

const CreateCustomerBranch = (props) => {
  const { visible, onHide,customer } = props
  const initial = {city_id: null}
  const [obj, setObj] = useState(initial)

  const { loading, error, data } = useQuery(
    CUSTOMER_BRANCH_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('createCustomerBranch error', error)

  const [insertCustomerBranch] = useMutation(
    INSERT_CUSTOMER_USERS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!')  
      setObj(initial) }
    }
  )

  var state = [];
  if (!loading) { 
     state = data.state 
  }
 
  const StateList = state.map((data) => {
    return { value: data.id, label: data.name }
  })

  const onCityChange = (city_id) => {
    setObj({ ...obj, city_id: city_id })
  }

  const onAddBranch = (form) => {
    console.log('inside form submit', form, obj)
    insertCustomerBranch({
      variables: {
        city_id: obj.city_id,
        customer_id: customer,
        mobile: form.mobile,
        name: form.name,
        address: form.address,
        pincode: form.pincode,
        branchname: form.branchname
      }
    })
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`)
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
              <Form.Item name='branchname' >
                <Input placeholder='Branch Name' />
              </Form.Item>
              <Form.Item name='name'>
                <Input placeholder='Name' />
              </Form.Item>
              <Form.Item name='address'>
                <Input placeholder='Building No ,Address' />
              </Form.Item>
              <Row gutter={6}>
                <Col xs={12}>
                <CitySelect
                label='City'
                onChange={onCityChange}
            />
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label='State'
                    name='State'
                    rules={[{ required: true, message: 'State is required field' }]}
                  >
                    <Select defaultValue='' onChange={handleChange}  options={StateList}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item name='pincode'>
                    <Input placeholder='Pin Code' />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name='mobile'>
                    <Input placeholder='Contact Number' />
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
    </>
  )
}

export default CreateCustomerBranch
