import { Table, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import EditBranch from '../customers/createCustomerBranch'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'

const CUSTOMER_BRANCH = gql`
subscription customer_users($cardcode: String) {
  customer(where: { cardcode: { _eq: $cardcode } }) {
    id
     customer_branches {
        id
        branch_name
        name
        address
        state_id
        state
        city
        city_id
        pincode
        mobile
      }
  }
}`

const Branch = (props) => {
  const { cardcode } = props

  const initial = {
    customerBranchVisible: false,
    customerBranchData: null
  }
  const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

  const { loading, data, error } = useSubscription(
    CUSTOMER_BRANCH,
    { variables: { cardcode: cardcode } }
  )

  console.log('customer_Branch Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer_branches = get(_data, 'customer[0].customer_branches', [])

  const column = [
    {
      title: 'Branch Name',
      dataIndex: 'branch_name',
      width: '15%'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '10%'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '15%'
    },
    {
      title: 'City',
      width: '10%',
      render: (text, record) => get(record, 'city', null)
    },
    {
      title: 'State',
      width: '10%',
      render: (text, record) => get(record, 'state', null)
    },
    {
      title: 'Pin',
      dataIndex: 'pincode',
      width: '10%'
    },
    {
      title: 'Contact No',
      dataIndex: 'mobile',
      width: '10%'
    },
    {
      title: 'Action',
      render: (text, record) => {
        console.log('record', record)
        return (
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => handleShow('customerBranchVisible', null, 'customerBranchdata', record)}
          />
        )
      },
      width: '10%'
    }
  ]
  console.log('customerbranches={}', object.customerBranchData)
  return (
    <>
      <Table
        columns={column}
        dataSource={customer_branches}
        rowKey={(record) => record.id}
        size='small'
        scroll={{ x: 800 }}
        pagination={false}
        className='withAction'
        loading={loading}
      />
      {object.customerBranchVisible && (
        <EditBranch
          visible={object.customerBranchVisible}
          onHide={handleHide}
          customerbranches={object.customerBranchData}
        />
      )}
    </>
  )
}

export default Branch
