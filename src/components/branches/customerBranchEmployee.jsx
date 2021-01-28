import { Table } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import { useState } from 'react'

const CUSTOMER_BRANCH_EMPLOYEE_SUBSCRIPTION = gql`
subscription customer_branch_employee($branch_employee_id: Int, $branch_id: Int) {
  customer_branch_employee(where: {branch_employee_id: {_eq: $branch_employee_id}}) {
    id
    truck_type_group {
      id
      name
    }
    customer {
      id
      name
      mobile
      customer_truck_type_group_load_count(where: {branch_id: {_eq: $branch_id}}) {
        truck_type_group_id
        branch_id
        loads
      }
    }
  }
}

`
const CustomerBranchEmployee = (props) => {
  const { record, customerBranchEmployee_ids, setCustomerBranchEmployee_ids, branch_id } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const customer_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setCustomerBranchEmployee_ids({ ...customerBranchEmployee_ids, customer_branch_employee_ids: customer_list })
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const { loading, data, error } = useSubscription(
    CUSTOMER_BRANCH_EMPLOYEE_SUBSCRIPTION,
    {
      variables: {
        branch_employee_id: record.id,
        branch_id: branch_id
      }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customers = get(_data, 'customer_branch_employee')

  const columns = [
    {
      title: 'Name',
      key: 'name',
      width: '40%',
      render: (text, record) => get(record, 'customer.name', '-')
    },
    {
      title: 'Mobile No',
      key: 'mobileNo',
      width: '20%',
      render: (text, record) => get(record, 'customer.mobile', '-')
    },
    {
      title: 'Truck group',
      key: 'truck_type_group',
      width: '20%',
      render: (text, record) => get(record, 'truck_type_group.name', '-'),
      sorter: (a,b) =>(a.truck_type_group.name - b.truck_type_group.name ? 1: -1)
    },
    {
      title: 'Load',
      key: 'load',
      width: '20%',
      render: (text, record) => get(record,'customer_truck_type_group_load_count[0].loads','0')
    //  sorter: (a, b) => a.customer.trips_aggregate.aggregate.count - b.customer.trips_aggregate.aggregate.count,
     // defaultSortOrder: 'descend'
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={customers}
      size='small'
      scroll={{ x: 450, y: 330 }}
      pagination={false}
      rowSelection={{ ...rowSelection }}
      rowKey={(record) => record.id}
      loading={loading}
      className='withAction'
    />
  )
}
export default CustomerBranchEmployee
