import { useState } from 'react'
import { message, Form, Select } from 'antd'
import { useMutation, useSubscription, gql } from '@apollo/client'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const { Option } = Select

const CUSTOMER_USER_QUERY = gql`
subscription customer_user($customer_id: Int!){
  customer_user(where:{customer_id:{_eq:$customer_id}}) {
    id
    mobile
  }
}`

const INSERT_CUSTOMER_USER = gql`
mutation insert_customer_user($customer_id:Int!, $mobile:String!){
  insert_customer_user(objects:{mobile:$mobile, customer_id:$customer_id }) {
    returning {
      id
    }
  }
}`

const LoadingPointContact = (props) => {
  const { customer, onUserChange } = props
  const customer_id = get(customer, 'id', null)
  if (!customer_id) return null

  const [searchText, setSearchText] = useState('')

  const onSearch = (value) => {
    setSearchText(value.substring(0, 10))
  }

  const { loading, error, data } = useSubscription(
    CUSTOMER_USER_QUERY, {
      variables: { customer_id }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }

  console.log('LoadingPointContact error', error)

  const user_data = get(_data, 'customer_user', [])

  const [insert_customer_user] = useMutation(
    INSERT_CUSTOMER_USER,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const id = get(data, 'insert_customer_user.returning[0].id', null)
        message.success('Updated!!')
        onUserChange(id)
        setSearchText('')
      }
    }
  )

  const handleUserChange = (value, option) => {
    if (isEmpty(user_data) || !user_data.some(_user => _user.mobile === value)) {
      insert_customer_user({
        variables: {
          customer_id,
          mobile: value
        }
      })
    } else { onUserChange(option.key) }
  }

  let users = []
  if (searchText && searchText.length >= 10) {
    users = [{ id: searchText, mobile: searchText }]
  } else {
    users = !isEmpty(user_data) && user_data.filter(_user => _user.mobile.search(searchText) !== -1)
  }
  return (
    <Form.Item
      label='Loading Point Contact'
      name='loading_contact'
      rules={[{ required: true }]}
      className='mobile-100percent hide-label'
    >
      <Select
        showSearch
        placeholder='Select Loading Contact...'
        onSearch={onSearch}
        onChange={handleUserChange}
        size='small'
      >
        {users && users.map(_user => (
          <Option key={_user.id} value={_user.mobile}>{_user.mobile}</Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default LoadingPointContact
