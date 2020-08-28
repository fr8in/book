
import { Row, Col, Modal, Button, Input, Select, Form,message } from 'antd'
//  import  {State}  from '../../../mock/customer/createCustomerBranchMock'
import { useMutation, gql,useQuery } from '@apollo/client'
import {useState} from 'react'
import CitySelect from '../common/citySelect'
const { Option } = Select

const CUSTOMER_BRANCH_QUERY = gql`
  query customerbranch{
    state{
      id
      name
    }
  }
`
const INSERT_CUSTOMER_BRANCH_MUTATION = gql`
mutation CustomerBranchInsert($address: String,$id:Int ,$branch_name: String, $mobile: String, $name: String, $pincode: Int, $state: Int,$city_id:Int) {
  insert_customer_branch(objects: {customer_id:$id,address: $address, branch_name: $branchname, mobile: $mobile, name: $name, pincode: $pincode, city_id: $city_id, state_id: $state}) {
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
const UPDATE_CUSTOMER_BRANCH_MUTATION = gql`
mutation CustomerBranchInsert($address: String, $id: Int, $branch_name: String, $mobile: String, $name: String, $customer_id: Int, $pincode: Int, $state: Int, $city_id: Int) {
  update_customer_branch(_set: {address: $address, branch_name: $branch_name, city_id: $city_id, mobile: $mobile, name: $name, pincode: $pincode, state_id: $state}, where: {customer_id: {_eq: $customer_id}, id: {_eq:  $id}}) {
    returning {
      customer_id
      city {
        name
      }
      state {
        name
      }
    }
  }
}
`

const CreateCustomerBranch = (props) => {
  const { visible, onHide,customerbranches } = props
  console.log('customerbranches',customerbranches)
  const initial = {city_id: null}
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
      onCompleted () { message.success('Updated!!')  
      setObj(initial) }
    }
  )

  const [updateCustomerBranch] = useMutation(
    UPDATE_CUSTOMER_BRANCH_MUTATION,
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
        id:customerbranches,
        mobile: form.mobile,
        name: form.name,
        address: form.address,
        pincode: form.pincode,
        branch_name: form.branch_name
      }
    })

  }

const branch_name= customerbranches.map(element => element.branch_name);
console.log(branch_name)
  
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
            <Form layout='vertical' onFinish={onAddBranch} >
              <Form.Item  name='branch_name' initialValue={branch_name} >
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
