import { Table } from 'antd'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import { useState } from 'react'

const CUSTOMER_BRANCH_EMPLOYEE_SUBSCRIPTION = gql`
subscription customer_branch_employee($id:Int){
  customer_branch_employee(where:{branch_employee_id:{_eq:$id}}){
    id
    customer{
      id
      name
      mobile
      trips_aggregate{
        aggregate{
          count
        }
      }
    }
  }
}
`
const CustomerBranchEmployee = (props) => {
  const { record, customerBranchEmployee_ids, setCustomerBranchEmployee_ids } = props

  const [selectedCustomer, setSelectedCustomer] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    const customer_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setSelectedCustomer(customer_list)
    setCustomerBranchEmployee_ids({...customerBranchEmployee_ids,customer_branch_employee_ids:customer_list})
  }

  const rowSelection =  {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const { loading, data, error } = useSubscription(
    CUSTOMER_BRANCH_EMPLOYEE_SUBSCRIPTION,
    {
      variables: { id: record.id }
    }
  )
  console.log('CustomerBranchEmployee Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer_branch_employee')

  const columns = [
    {
      title: 'Name',
      key:'name',
      width: '45%',
      render: (text, record) => get(record, 'customer.name')
    },
    {
      title: 'Mobile No',
      key: 'mobileNo',
      width: '35%',
      render: (text, record) => get(record, 'customer.mobile')
    },
    {
      title: 'Load',
      key: 'load',
      width: '20%',
      render: (text, record) => get(record, 'customer.trips_aggregate.aggregate.count'),
      sorter: (a, b) => a.customer.trips_aggregate.aggregate.count - b.customer.trips_aggregate.aggregate.count,
      defaultSortOrder:'descend'
    }
  ]
  return (
    <Table
      columns={columns}
      dataSource={customer}
      size='small'
      scroll={{ x: 450, y: 330 }}
      pagination={false}
      rowSelection={{...rowSelection }}
      rowKey={(record) => record.id}
      loading={loading}
      className='withAction'
    />
  )
}
export default CustomerBranchEmployee