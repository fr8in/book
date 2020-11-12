import { Table } from 'antd'
import React from 'react'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import EmployeeList from '../fr8employeeEdit'
import u from '../../../lib/util'

const EMPLOYEE_SUBSCRIPTION = gql`
subscription customer_branch_employees($id:Int!){
  customer(where: { id:{_eq: $id}}){
    id
    cardcode
    updated_at
    customer_branch_employees(order_by:{branch_employee:{branch:{displayposition:asc}}}){
      id
      branch_employee{
        id
        employee{
          id
          name
          email
        }
        branch{
          id
          name
        }
        is_manager
      }
    }
  }
}
`
const CustomersContainer = (props) => {
  const { id } = props
  const { role } = u
  const trafficEdit = [role.user]

  const { loading, error, data } = useSubscription(
    EMPLOYEE_SUBSCRIPTION,
    { variables: { id: id } }
  )


  let _data = []
  if (!loading) {
    _data = data
  }
  const customer_branch_employees = get(_data, 'customer[0].customer_branch_employees', [])

  const column = [
    {
      title: 'Branch Name',
      width: '50%',
      render: (record) => get(record, 'branch_employee.branch.name')
    },
    {
      title: 'Traffic',
      width: '50%',
      render: (record) => {
        const employee = get(record, 'branch_employee.employee.name', null)
        return (
          <EmployeeList
            employee={employee}
            id={record.id}
            edit_access={trafficEdit}
            branch_id={get(record, 'branch_employee.branch.id', null)}
            customer_id={id}
          />
        )
      }
    }
  ]

  return (
    <>
      <Table
        columns={column}
        dataSource={customer_branch_employees}
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
