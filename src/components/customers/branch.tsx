import { Table, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { gql, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import EditBranch from '../customers/createCustomerBranch'
import useShowHidewithRecord from '../../hooks/useShowHideWithRecord'

const CUSTOMER_BRANCH = gql`
subscription customer_branch($cardcode: String) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    customer_offices {
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
}
`

const Branch = (props) => {
  const { cardcode } = props
  const initial = { visible: false, data: null }
  const { object, handleHide, handleShow } = useShowHidewithRecord(initial)

  const { loading, data, error } = useSubscription(
    CUSTOMER_BRANCH,
    { variables: { cardcode: cardcode } }
  )

  console.log('customer_Branch Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer_branches = get(_data, 'customer[0].customer_offices', [])

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
      width: '25%'
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
      width: '8%'
    },
    {
      title: 'Contact No',
      dataIndex: 'mobile',
      width: '8%'
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => handleShow('visible', null, 'data', record)}
          />
        )
      },
      width: '4%'
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
      {object.visible &&
        <EditBranch
          visible={object.visible}
          customerbranches={object.data}
          onHide={handleHide}
        />}
    </>
  )
}

export default Branch
