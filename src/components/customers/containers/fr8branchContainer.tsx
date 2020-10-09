import { Table } from 'antd'
import React from 'react'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import EmployeeList from '../fr8employeeEdit'
import u from '../../../lib/util'

const EMPLOOYEE_QUERY = gql`
subscription customer_fr8Branch_manager($id: Int){
  branch(order_by: {displayposition: asc}){
    id
    name
    branch_employees(where: {is_manager:{_eq: true}}){
      customer_branch_employees(where:{customer_id:{_eq:$id}}){
        id
        customer_id
        branch_employee{
          id
          employee{
            id
            email
            name
          }
        }
      }
      employee{
        id
        name
        email
      }
    }
  }
}
`
const CustomersContainer = (props) => {
  const { id } = props
  const { role } = u
  const trafficEdit = [role.user]
  const variables = {
    id: id
  }

  const { loading, error, data } = useSubscription(
    EMPLOOYEE_QUERY,
    {
      variables: variables
    })
  console.log('error', error)
  
  let _data = []
  if (!loading) {
    _data = data
  }
  const branches = get(_data, 'branch', [])

  const column = [
    {
      title: 'Branch Name',
      dataIndex: 'name',
      width: '50%'
    },
    {
      title: 'Traffic',
      width: '50%',
      render: (record) => {
        const customer_branch_employees = get(record, 'branch_employees[0].customer_branch_employees[0]', null)
        const branch_employees = get(record, 'branch_employees[0].customer_branch_employees[0].branch_employee.employee', null)
        const employee = get(record, 'branch_employees[0].employee', null)
        const emp = customer_branch_employees ? branch_employees && branch_employees.name : employee && employee.name 
        return <EmployeeList employee={emp} id={record.id} edit_access={trafficEdit}/>
      }
    }
  ]

  return (
    <>
      <Table
        columns={column}
        dataSource={branches}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 800 }}
        pagination={false}
        loading={loading}
      />
    </>
  )
}

export default CustomersContainer
