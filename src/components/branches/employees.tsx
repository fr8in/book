import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import EmployeeNumber from './employeeNumber'

const EMPLOYEE_QUERY = gql`
query branch_employee {
  employee(where:{active: {_eq: 1}}){
    id
    name
    mobileno
  }
}`

const Employees = (props) => {
  const { loading, error, data } = useQuery(
    EMPLOYEE_QUERY, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('BranchesContainer error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const employees = get(_data, 'employee', [])

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '10%'
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileno',
      width: '20%',
      render: (text, record) => {
        return <EmployeeNumber id={record.id} label={text} />
      }
    }
  ]

  return (
    <Table
      columns={column}
      dataSource={employees}
      size='small'
      scroll={{ x: 800, y: 400 }}
      rowKey={record => record.id}
      pagination={false}
      loading={loading}
    />
  )
}

export default Employees
