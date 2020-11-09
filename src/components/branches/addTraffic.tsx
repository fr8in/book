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
import moment from 'moment'

const ALL_EMPLOYEE = gql`
query all_employee {
  employee(where:{active: {_eq: 1}}){
  id
  email
}
}`
const UPDATE_CUSTOMER_BRANCH_EMPLOYEE_MUTATION = gql`
mutation customer_branch_employee($ids: [Int!], $branch_employee_id: Int) {
  update_customer_branch_employee(where: {id: {_in: $ids}}, _set: {branch_employee_id: $branch_employee_id}) {
    returning {
      id
    }
  }
}
`
const IS_MANAGER_MUTATION = gql`
mutation update_is_manager($is_manager: Boolean, $branch_id: Int!, $employee_id: Int!){
  update_branch_employee(_set:{is_manager: $is_manager}, where:{branch_id:{_eq:$branch_id}, id: {_eq: $employee_id}}){
    returning{
      id
    }
  }
}`

const INSERT_BRANCH_EMPLOYEE = gql`
mutation insert_traffic($branch_id: Int!, $employee_id: Int!){
  insert_branch_employee(objects:{branch_id: $branch_id, employee_id:$employee_id, is_manager: false}){
    returning{
      id
    }
  }
}`

const DELETE_BRANCH_EMPLOYEE = gql`
mutation update_branch_employee($id: Int!, $date: timestamp) {
  update_branch_employee(where: {id: {_eq: $id}}, _set: {deleted_at: $date}) {
    returning {
      id
    }
  }
}
`

const AddTraffic = (props) => {
  const { visible, onHide, branch_data, title, edit_access_delete } = props
  const initial = { customer_branch_employee_ids: 0 }

  const [addTraffic, setAddTraffic] = useState(false)
  const [swapTraffic, setSwapTraffic] = useState(false)
  const [employee_id, setEmployee_id] = useState(null)
  const [branchEmployee_id, setBranchEmployee_id] = useState(null)
  const [customerBranchEmployee_ids, setCustomerBranchEmployee_ids] = useState(initial)
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

  const [branch_employee] = useMutation(
    UPDATE_CUSTOMER_BRANCH_EMPLOYEE_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() {
        message.success('Updated!!')
      }
    }
  )

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

  const { employee } = data

  const employee_list = employee.map((_employee) => {
    return { value: _employee.id, label: _employee.email }
  })
  const branch_employees = branch_data.branch_employees
  const branch_employee_list = branch_employees.map((branch_employee) => {
    return { value: branch_employee.id, label: branch_employee.employee.email }
  })

const date =moment(new Date().toISOString()).format('DD-MMM-YY')

  const onTrafficChange = () => {
    setAddTraffic(!addTraffic)
    setSwapTraffic(false)
  }
   
  const onSwapChange = () => {
    setSwapTraffic(!swapTraffic)
    setAddTraffic(false)
  }
  const onChange = (value) => {
    setEmployee_id(value)
  }
  const onBranchEmployeeChange = (value) => {
    setBranchEmployee_id(value)
  }
  const onAddTraffic = () => {
    insert_traffic({
      variables: {
        branch_id: branch_data.id,
        employee_id: employee_id
      }
    })
  }
  const onSwapTraffic = () => {
    branch_employee({
      variables: {
        ids: customerBranchEmployee_ids.customer_branch_employee_ids,
        branch_employee_id: branchEmployee_id
      }
    })
  }
  const onIsManagerChange = (e, employee_id) => {
    is_manager_update({
      variables: {
        is_manager: e.target.checked,
        employee_id: employee_id,
        branch_id: branch_data.id
      }
    })
  }
  const onDelete = (id) => {
    delete_traffic({
      variables: {
        id: id,
        date: date
      }
    })
  }
  const BranchTraffic = (
    <Row><Space>
      <Button size='small' type='primary' defaultChecked={addTraffic} icon={<PlusOutlined />} onClick={onTrafficChange} />
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
      render: (record) =>{
        const count = get(record, 'customer_branch_employees_aggregate.aggregate.count' ,0) 
      return(
        access
          ?<Button 
          type="link" 
          icon={<DeleteTwoTone twoToneColor='#eb2f96'/>  }  
          onClick={() => onDelete(record.id)} 
          disabled={record.is_manager || !!count }
          /> : null)}
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
      style={{ top: 2 }}
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
                    onChange={onBranchEmployeeChange}
                    showSearch
                  />
                </Col>
                <Col flex='100px'>
                  <Button
                    key='submit'
                    type='primary'
                    onClick={onSwapTraffic}
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
        size='small'
        pagination={false}
        scroll={{ x: 420 }}
        rowKey={(record) => record.id}
        expandedRowRender={record =>
          <CustomerBranchEmployee
            record={record}
            customerBranchEmployee_ids={customerBranchEmployee_ids}
            setCustomerBranchEmployee_ids={setCustomerBranchEmployee_ids}
          />
        }
      />
    </Modal>
  )
}

export default AddTraffic
