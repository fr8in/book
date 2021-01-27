import { Table, Tag } from 'antd'
import React from 'react'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import u from '../../../lib/util'
import EditAccess from '../../common/editAccess';
import useShowHideWithRecord from '../../../hooks/useShowHideWithRecord';
import EmployeeListModal from '../employeeListModal';

const EMPLOYEE_SUBSCRIPTION = gql`
subscription customer_branch_employees($id:Int!){
  customer(where: { id:{_eq: $id}}){
    id
    cardcode
    updated_at
    customer_branch_employees(order_by:{branch_employee:{branch:{displayposition:asc}}}){
      id
      truck_type_group_id
      truck_type_group{
        id
        name
      }
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
  const initial = {
    trafficVisible: false,
    trafficData: {},
    title: null,
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)
  const { loading, error, data } = useSubscription(
    EMPLOYEE_SUBSCRIPTION,
    { variables: { id: id } }
  )

  let _data = []
  if (!loading) {
    _data = data
  }
  const customer_branch_employees = get(_data, 'customer[0].customer_branch_employees', [])
  const groupedData = u.groupByMultipleProperty(customer_branch_employees, function (item: any) {
    return [item.branch_employee.branch.name];
})
  const column = [
    {
      title: 'Branch Name',
      width: '50%',
      render: (record) =>{
        return(
          get(record[0], 'branch_employee.branch.name', null)
        )
      } 
    },
    {
      title: 'Traffic',
      width: '50%',
      render: (record) => {    
        return (
          <>
           {record.length > 0
          ? record.map((data, i) =>  <Tag className='small-tag' key={i}>        
             <span>{`${data.truck_type_group.name} - ${data.branch_employee.employee.name}`}</span> 
            </Tag>)
          : null}
            <EditAccess
              edit_access={trafficEdit}
              onEdit={() => handleShow('trafficVisible', get(record[0], 'branch_employee.branch.name', null), 'trafficData', record)}
            />
          </>
        )
      }
    }
  ]

  return (
    <>
      <Table
        columns={column}
        dataSource={groupedData}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 800 }}
        pagination={false}
        loading={loading}
      />
      {object.trafficVisible &&
        <EmployeeListModal
          visible={object.trafficVisible}
          onHide={handleHide}
          title={object.title}
          employeeData={object.trafficData}
          edit_access={trafficEdit}
          customer_id={id}
        />
      }
    </>
  )
}

export default CustomersContainer
