import { useState, useContext } from 'react'
import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Table,
  Radio,
  Col,
  Space,
  message
} from 'antd'
import { DeleteTwoTone, SwapOutlined, PlusOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import { gql, useMutation, useQuery } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import isEmpty from 'lodash/isEmpty'
import CustomerBranchEmployee from './customerBranchEmployee'



const ALL_EMPLOYEE = gql`
query all_employee {
  employee(where:{active: {_eq: 1}}){
  id
  email
}
}`
const BRANCH_EMPLOYEE = gql`
query branch_employee($id:Int){
  branch_employee(where:{branch_id:{_eq:$id}}){
    employee{
      id
      name
      email
    }
  }
}`

const IS_MANAGER_MUTATION = gql`
mutation update_is_manager($is_manager: Boolean, $branch_id: Int!, $emp_id: Int!){
  update_branch_employee(_set:{is_manager: $is_manager}, where:{branch_id:{_eq:$branch_id}, id: {_eq: $emp_id}}){
    returning{
      id
    }
  }
}`

const INSERT_BRANCH_EMPLOYEE = gql`
mutation insert_traffic($branch_id: Int!, $emp_id: Int!){
  insert_branch_employee(objects:{branch_id: $branch_id, employee_id:$emp_id, is_manager: false}){
    returning{
      id
    }
  }
}`

const DELETE_BRANCH_EMPLOYEE = gql`
mutation delete_traffic($id: Int!){
  delete_branch_employee(where:{id:{_eq: $id}}){
    returning{
      id
    }
  }
}`

const AddTraffic = (props) => {
  const { visible, onHide, branch_data, title, edit_access_delete } = props
  console.log('branch_data', branch_data)
  const [emp_id, setEmp_id] = useState(null)
  const [addTraffic, setAddTraffic] = useState(false)
  const [swapTraffic, setSwapTraffic] = useState(false)
  const context = useContext(userContext)
  const access = !isEmpty(edit_access_delete) ? context.roles.some(r => edit_access_delete.includes(r)) : false

  const { loading, data, error } = useQuery(
    ALL_EMPLOYEE,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('employee error', error)

  const { data: employee_data, error : branch_employee_error } = useQuery(
    BRANCH_EMPLOYEE,
    {
      variables: { id: branch_data.id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('branch_employee data',employee_data)

  const [is_manager_update] = useMutation(
    IS_MANAGER_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const [insert_traffic] = useMutation(
    INSERT_BRANCH_EMPLOYEE,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        message.success('Added!!')
        onHide()
      }
    }
  )

  const [delete_traffic] = useMutation(
    DELETE_BRANCH_EMPLOYEE,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        message.success('Deleted!!')
        onHide()
      }
    }
  )

  if (loading) return null
  console.log('CustomerType error', error)

  const { employee } = data
  console.log('employee',employee)
  const employee_list = employee.map((data) => {
    return { value: data.id, label: data.email }
  })
  const branch_employee_data =branch_data.branch_employees 
  const branch_employee_list = branch_employee_data.map((data) => {
    return { value: data.employee && data.employee.id, label:data.employee && data.employee.email }
  })
  console.log('data',branch_employee_data)
  console.log('list',branch_employee_list)
  const onIsManagerChange = (e, emp_id) => {
    is_manager_update({
      variables: {
        is_manager: e.target.checked,
        emp_id: emp_id,
        branch_id: branch_data.id
      }
    })
  }
  const onSetChange = (value) => {
    setAddTraffic(value)
  }
  const onSwapChange = () => {
    setSwapTraffic(true)
  }
  const onChange = (value) => {
    setEmp_id(value)
  }
  const onAddTraffic = () => {
    insert_traffic({
      variables: {
        branch_id: branch_data.id,
        emp_id: emp_id
      }
    })
  }

  const onDelete = (id) => {
    delete_traffic({
      variables: {
        id: id
      }
    })
  }
  const BranchTraffic = (
    <Row><Space>
      <Button size='small' type='primary' defaultChecked={addTraffic} icon={<PlusOutlined />} onClick={onSetChange} /> 
      <Button size='small' type='primary' icon={<SwapOutlined />} onClick={onSwapChange} />
    </Space>
    </Row>
  )
  const Traffic = [
    {
      title: 'BM.Traffic',
      render: (text, record) => {
        const name = get(record, 'employee.name', null)
        return (
          <Radio
            checked={record.is_manager}
            onChange={(e) => onIsManagerChange(e, record.id)}
          >
            {name}
          </Radio>
        )
      }
    },
    {
      title: 'Phone',
      render: (text, record) => get(record, 'employee.mobileno', null)
    },
    {
      title: 'Action',
      render: (record) =>
        access
          ? <DeleteTwoTone twoToneColor='#eb2f96' onClick={() => onDelete(record.id)} /> : null
    },
    {
      title: BranchTraffic,
      width: '10%'
    }
  ]

  return (
    <Modal
      visible={visible}
      title={` ${title} Traffic`}
      onCancel={onHide}
      style={{ top:2 }}
      width={750}
      footer={[]}
    >
      <Form>{
        addTraffic ?
          <Form.Item name='employee'>
            <Row gutter={10}>
              <Col flex='auto'>
                <Select
                  placeholder='Select Type'
                  options={employee_list}
                  optionFilterProp='label'
                  onChange={onChange}
                  showSearch
                />
              </Col>
              <Col flex='100px'>
                <Button
                  key='submit'
                  type='primary'
                  onClick={onAddTraffic}
                >
                  Add 
              </Button>
              </Col>
            </Row>
          </Form.Item> : null
      }
        {
          swapTraffic ?
            <Form.Item name='branch_employee'>
              <Row gutter={10}>
                <Col flex='auto'>
                  <Select
                    placeholder='Select Type'
                    options={branch_employee_list}
                    optionFilterProp='label'
                    onChange={onChange}
                    showSearch
                  />
                </Col>
                <Col flex='100px'>
                  <Button
                    key='submit'
                    type='primary'
                    onClick={onAddTraffic}
                  >
                    Swap 
                 </Button>
                </Col>
              </Row>
            </Form.Item> : null
        }

      </Form>
      <Table
        columns={Traffic}
        dataSource={branch_data.branch_employees}
        expandedRowRender={record => <CustomerBranchEmployee record={record} />}
        size='small'
        pagination={false}
        scroll={{ x: 420 }}
        rowKey={(record) => record.id}
      />
    </Modal>
  )
}

export default AddTraffic
