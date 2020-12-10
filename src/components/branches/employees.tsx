import { Table, Tag } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import EmployeeNumber from './employeeNumber'
import EditAccess from '../common/editAccess'
import u from '../../lib/util'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import EmployeeRoleAccess from '../branches/employeeRoleAccess'

const EMPLOYEE_QUERY = gql`
query branch_employee {
  employee(where: {active: {_eq: 1}}) {
    id
    name
    mobileno
    employee_roles {
      id
      role {
        name
      }
    }
  }
}
`

const Employees = (props) => {

  const { role } = u
  const employee_role = [role.user]
  const initial = {
    employeeRoleVisible: false,
    title: null,
    employeeRoleData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)


  const { loading, error, data } = useQuery(
    EMPLOYEE_QUERY, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )


  let _data = {}
  if (!loading) {
    _data = data
  }
  const employees = get(_data, 'employee', [])

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%'
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobileno',
      width: '20%',
      render: (text, record) => {
        return <EmployeeNumber id={record.id} label={text} />
      }
    },
    {
      title: 'Roles',
      dataIndex: 'role',
      width: '60%',
      render: (text, record) => {
        const roles = get(record, 'employee_roles', '-')
        return (
          <div className='cell-wrapper'>

            { roles.length > 0
              ? record.employee_roles && record.employee_roles.map((data, i) => (
                <Tag className='small-tag' key={i}>
                  {data.role.name}
                </Tag>
              ))
              : null}
            <EditAccess
              edit_access={employee_role}
              onEdit={() => handleShow('employeeRoleVisible', record.name, 'employeeRoleData', record)}
            />
          </div>
        )
      }
    }
  ]
  return (
    <>
      <Table
        columns={column}
        dataSource={employees}
        size='small'
        scroll={{ x: 800 }}
        rowKey={record => record.id}
        pagination={false}
        loading={loading}
      />
      {object.employeeRoleVisible && (
        <EmployeeRoleAccess
          visible={object.employeeRoleVisible}
          onHide={handleHide}
          employee_data={object.employeeRoleData}
          title={object.title}
        //edit_access_delete={employee_member_delete}
        />
      )}
    </>
  )
}

export default Employees
