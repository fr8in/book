import { Table, Button, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { gql, useMutation, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import Phone from '../common/phone'
import u from '../../lib/util'

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
mutation customer_users_delete($description: String, $topic: String, $customer_id: Int, $created_by: String,$id:Int) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  delete_customer_user( where: {id: {_eq:$id}}) {
    returning {
      id
      mobile
    }
  }
}`

const Users = (props) => {
  const { cardcode,edit_access,customer_id } = props
  const { topic } = u
  const context = useContext(userContext)
  const transferAccess = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const { loading, data, error } = useSubscription(
    CUSTOMER_USER,
    { variables: { cardcode: cardcode } }
  )


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
        id: id,
        created_by: context.email,
        description:`${topic.customer_user} deleted by ${context.email}`,
        topic:topic.customer_user,
        customer_id: customer_id
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
      render: (text, record) =>  <Phone number={record.mobile} />,
      width: '25%'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => text,
      width: '30%'
    },
    transferAccess ?
    {
      title: 'Action',
      render: (text, record) => (
        <span className='actions'>
          <Button type='link' icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
        </span>
      ),
      width: '20%'
    } : {}
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
