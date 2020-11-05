import { Table } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import { useState } from 'react'

const CUSTOMER_BRANCH_EMPLOYEE_QUERY = gql`
query customer_branch_employee($id:Int){
    customer_branch_employee(where: {branch_employee_id: {_eq: $id}}) {
      customer {
        id
        name
        mobile
        trips_aggregate(where: {branch_employee_id: {_eq: $id}}){
          aggregate{
            count
          }
        }
      }
    }
  }  
`

const CustomerBranchEmployee = (props) => {
  const { record } = props
  console.log('id', record.id)
  const [selectedTrips, setSelectedTrips] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

 
  
  const { loading, data, error } = useQuery(
    CUSTOMER_BRANCH_EMPLOYEE_QUERY,
    {
      variables: { id: record.id }
    }
  )
  console.log('CustomerBranchEmployee Error', error)
  console.log('CustomerBranchEmployee data', data)

  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer = get(_data, 'customer_branch_employee')

  console.log('customer', customer)

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRows',selectedRows.map(row => row.id)) 
    const employee_list = selectedRows && selectedRows.length > 0 ? selectedRows.map(row => row.customer && row.customer.customer && row.customer.customer.id) : []
    setSelectedRowKeys(selectedRowKeys)
    setSelectedTrips(employee_list)
    console.log('employee_list',employee_list)
  }
  
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  console.log('rowSelection',rowSelection)


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