import { Modal, Form, Input, Select,message ,Row,Col,Button,Space} from 'antd'
import React from 'react'
import { gql, useMutation,useQuery } from '@apollo/client'

 const ADD_BRANCH_SUBSCRIPTION = gql`
 query add_branch{
  employee{
    id
    email
  }
  region{
    id
    name
  }
}
`

const INSERT_BRANCH_MUTATION = gql`
mutation insert_branch(
  $name: String!,
  $region_id: Int,
  $displayposition: Int,
  $data: [branch_employee_insert_input!]!
) {
  insert_branch(objects: {
    name: $name, 
    branch_employees: {data: $data},
    region_id: $region_id,
    displayposition: $displayposition
  }) {
    returning{
      id
      name
    }
  }
}
`

const AddBranch = (props) => {
  const { visible, onHide } = props

  const { loading, error, data } = useQuery(
    ADD_BRANCH_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('AddBranch error', error)

  const [updateBranch] = useMutation(
    INSERT_BRANCH_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )


  var employee = [];
  var region = [];
  if (!loading) {
     region = data.region
     employee = data.employee
  }
 
  const regionList = region.map((data) => {
    return { value: data.id, label: data.name }
  })
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  
  const onSubmit = (form) => {
    console.log('form',form)
    const bm_traffic = [
      { employee_id: form.bm_id, is_manager: true },
      { employee_id: form.traffic_id, is_manager: false}
    ]
  const bm= [
      { employee_id: form.bm_id, is_manager: true }
    ]  
    console.log('bm_traffic',bm_traffic)
    console.log('bm',bm)
    updateBranch({
      variables: {
      name: form.name,
      data:form.bm_id && form.traffic_id ? bm_traffic : bm,
      region_id: form.region,
      displayposition: form.display_position
      }
    })
    onHide()   
  }

  return (
    <Modal
      title='Add Branch'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form onFinish={onSubmit}>
        <Form.Item name='name'>
          <Input placeholder='Branch Name' />
        </Form.Item>
        <Form.Item name='bm_id'>
          <Select placeholder='Branch Manager'>
                <Select.Option  options={employeeList} value='Branch Manager'> </Select.Option>
              </Select>
        </Form.Item>
        <Form.Item name='traffic_id'>
        <Select placeholder='Traffic Coordinator'>
                <Select.Option  options={employeeList} value='Traffic Coordinator'> </Select.Option>
              </Select>
        </Form.Item>
        <Form.Item name='display_position'>
          <Input placeholder='Display Position' />
        </Form.Item>
        <Form.Item name='region'>
        <Select placeholder='Region'>
                <Select.Option  options={regionList} value='Region'> </Select.Option>
              </Select>
        </Form.Item>

        <Row justify='end'>
        <Col xs={24} className='text-right'>
        <Space>
          <Button>Cancel</Button>
          <Button type='primary' htmlType='submit' >Submit</Button>
          </Space>
        </Col>
      </Row>
      </Form>
    </Modal>
  )
}

export default AddBranch
