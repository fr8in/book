import { Table, Button, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { gql, useMutation, useSubscription } from '@apollo/client'
import get from 'lodash/get'

const CUSTOMER_USER = gql`
subscription customer_users($cardcode: String!) {
  customer(where: { cardcode: { _eq: $cardcode } }) {
    customer_users{
      id
      name
      mobile
      email
    }
  }
}`

const DELETE_CUSTOMER_USER_MUTATION = gql`
mutation customer_users_delete($id:Int) {
  delete_customer_user( where: {id: {_eq:$id}}) {
    returning {
      id
      mobile
    }
  }
}`

const Users = (props) => {
  const { cardcode } = props

  const { loading, data, error } = useSubscription(
    CUSTOMER_USER,
    { variables: { cardcode: cardcode } }
  )

  console.log('customer_users Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const customer_users = get(_data, 'customer[0].customer_users', [])

  const [deletecustomer_users] = useMutation(
    DELETE_CUSTOMER_USER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onDelete = (id) => {
    deletecustomer_users({
      variables: {
        id: id
      }
    })
  }

  const column = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => text,
      width: '25%'
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobile',
      render: (text, record) => text,
      width: '25%'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => text,
      width: '30%'
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span className='actions'>
          <Button type='link' icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
        </span>
      ),
      width: '20%'
    }
  ]

  return (
    <Table
      columns={column}
      dataSource={customer_users}
      size='small'
      scroll={{ x: 800 }}
      rowKey={record => record.id}
      pagination={false}
      loading={loading}
    />
  )
}

export default Users
