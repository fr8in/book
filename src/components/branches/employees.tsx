import { Table, Tag } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import EmployeeNumber from './employeeNumber'
import EditAccess from '../common/editAccess'
import u from '../../lib/util'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import EmployeeRoleAccess from '../branches/employeeRoleAccess'
import EmployeeCode from './employeeCode'

const EMPLOYEE_QUERY = gql`
subscription branch_employee {
  employee(where: {active: {_eq: 1}}) {
    id
    name
    mobileno
    email
    employee_code
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
  const employee_role = [role.admin]
  const initial = {
    employeeRoleVisible: false,
    title: null,
    employeeRoleData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)


  const { loading, error, data } = useSubscription( EMPLOYEE_QUERY )


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
      title: 'Employee Code',
      dataIndex: 'employee_code',
      width: '20%',
      render: (text,record) =>{
         return <EmployeeCode id={record.id} code={text} />
      }
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
      width: '40%',
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
        />
      )}
    </>
  )
}

export default Employees
