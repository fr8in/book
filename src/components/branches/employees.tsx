import { Table, Tag, Button, message } from 'antd'
import { gql, useSubscription, useMutation } from '@apollo/client'
import get from 'lodash/get'
import EmployeeNumber from './employeeNumber'
import EditAccess from '../common/editAccess'
import u from '../../lib/util'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import EmployeeRoleAccess from '../branches/employeeRoleAccess'
import EmployeeCode from './employeeCode'
import { DeleteTwoTone } from '@ant-design/icons'
import moment from 'moment'

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
const DELETE_EMPLOYEE_MUTATION = gql`
mutation delete_employee($id: Int, $date: timestamp) {
  update_employee(where: {id: {_eq: $id}}, _set: {deleted_at: $date}) {
    returning {
      id
    }
  }
}
`
const Employees = () => {

  const { role } = u
  const employee_role = [role.admin]
  const initial = {
    employeeRoleVisible: false,
    title: null,
    employeeRoleData: []
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const date =moment(new Date().toISOString()).format('DD-MMM-YY')
  const { loading, error, data } = useSubscription( EMPLOYEE_QUERY )

  const [deleteEmployee] = useMutation(
    DELETE_EMPLOYEE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )
  const onSubmit = (record) => {
    deleteEmployee({
      variables: {
        id: record.id,
        date: date
      }
    })
  }

  let _data = {}
  if (!loading) {
    _data = data
  }
  const employees = get(_data, 'employee', [])
console.log('employees',employees)
  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%'
    },
    {
      title: 'Employee Code',
      dataIndex: 'employee_code',
      width: '16%',
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
      title: '',
      width: '4%',
      render: (record) => {
        return (
            <Button
                type="link"
                icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                onClick={() => onSubmit(record)}
            />)
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
