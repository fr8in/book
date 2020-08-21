
import { Row, Col, Modal, Button, Input, Select, Form,message } from 'antd'
import { City, State } from '../../../mock/customer/createCustomerBranchMock'
import { useMutation, gql } from '@apollo/client'

const INSERT_CUSTOMER_USERS_MUTATION = gql`
mutation CustomerBranchInsert($address:String,$branchname:String,$mobile:String,$name:String, $pincode: Int,$customer_id:Int){
  insert_customer_branch(objects: {address: $address, branch_name: $branchname, mobile: $mobile, name: $name, pincode: $pincode, customer_id: $customer_id}) {
    returning {
      customer_id
    }
  }
}
`

const CreateCustomerBranch = (props) => {
  const { visible, onHide,customer } = props

  const [insertCustomerBranch] = useMutation(
    INSERT_CUSTOMER_USERS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onAddBranch = (form) => {
    insertCustomerBranch({
      variables: {
        customer_id: customer,
        mobile: form.mobile,
        name: form.name,
        address: form.address,
        pincode: form.pincode,
        branchname: form.branchname
      }
    })
    form.resetFields()
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
              <Form.Item name='branchname'>
                <Input placeholder='Branch Name' />
              </Form.Item>
              <Form.Item name='name'>
                <Input placeholder='Name' />
              </Form.Item>
              <Form.Item name='address'>
                <Input placeholder='Building Number' />
              </Form.Item>
              <Form.Item name='address'>
                <Input placeholder='Address' />
              </Form.Item>
              <Row gutter={6}>
                <Col xs={12}>
                  <Form.Item
                    label='City'
                    name='City'
                    rules={[{ required: true, message: 'City is required field' }]}
                  >
                    <Select defaultValue='' onChange={handleChange} options={City} />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item
                    label='State'
                    name='State'
                    rules={[{ required: true, message: 'State is required field' }]}
                  >
                    <Select defaultValue='' onChange={handleChange} options={State} />
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
