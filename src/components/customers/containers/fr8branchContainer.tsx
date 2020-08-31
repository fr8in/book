import { Table } from 'antd'
import React from 'react'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import EmployeeList from '../fr8employeeEdit'

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

  const variables = {
    id: id
  }

  const { loading, error, data } = useSubscription(
    EMPLOOYEE_QUERY,
    {
      variables: variables
    })
  console.log('error', error)
  console.log('id', variables)

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
        const branch_employee = get(record, 'branch_employees', null)
        const customer_branch_employees = get(record, 'branch_employees[0].customer_branch_employees[0]', null)
        const branch_employees = get(record, 'branch_employees[0].customer_branch_employees[0].branch_employee.employee', null)
        const employee = get(record, 'branch_employees[0].employee', null)
        const emp = (branch_employee ? (customer_branch_employees ? branch_employees && branch_employees.name : (employee ? employee && employee.name : null)) : null)
        return <EmployeeList employee={emp} />
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
