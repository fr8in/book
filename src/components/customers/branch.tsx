import { Table, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import EditBranch from '../customers/createCustomerBranch'
import useShowHideWithRecord from '../../hooks/useShowHideWithRecord'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'

const CUSTOMER_BRANCH = gql`
subscription customer_users($cardcode: String) {
  customer(where: { cardcode: { _eq: $cardcode } }) {
    id
     customer_branches {
        id
        branch_name
        name
        address
        state {
         name
        }
        city {
         name
        }
        pincode
        mobile
      }
  }
}`

const Branch = (props) => {
  const { cardcode } = props

  const initial = {
    customerBranchVisible: false,
    title: null,
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
      render: (text, record) => get(record, 'city.name', null)
    },
    {
      title: 'State',
      width: '10%',
      render: (text, record) => get(record, 'state.name', null)
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
      render: (text, record) => (
        <span>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => handleShow('customerBranchVisible', null, 'customerBranchdata', get(record, 'customer_branches.id', null))}
          />
        </span>
      ),
      width: '10%'
    }
  ]

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
          title={object.title}
        />
      )}
    </>
  )
}

export default Branch
