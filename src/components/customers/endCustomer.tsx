import { message, Select, Form } from 'antd'
import { useMutation, useSubscription, gql } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import get from 'lodash/get'

const { Option } = Select

const END_CUSTOMER_QUERY = gql`
subscription end_customer{
    end_customer{
      id 
      name
    }  
    }`


    const INSERT_END_CUSTOMER = gql`
    mutation end_customer_insert( $name: String){
        insert_end_customer(objects:{ name:$name}){
          returning{
            id
          }
        }
      }`

      const UPDATE_END_CUSTOMER_MUTATION = gql`
      mutation end_customer($end_customer_id:Int,$trip_id:Int!,$updated_by: String!) {
        update_trip(_set: {end_customer_id: $end_customer_id,updated_by:$updated_by}, where: {id: {_eq: $trip_id}}){
          returning{
            id
          }
        }
      }`


const EndCustomer = (props) => {
    const { trip_info, initialValue, disable, size, toggleDriver, nolabel } = props

    const [searchText, setSearchText] = useState('')
    const context = useContext(userContext)
    const onSearch = (value) => {
      setSearchText(value.substring(0, 20))
    }
  

  const { loading, error, data } = useSubscription(END_CUSTOMER_QUERY)

  let _data = {}
  if (!loading) {
    _data = data
  }

  console.log('End Customer error', error)

  const [insertEndCustomer] = useMutation(
    INSERT_END_CUSTOMER,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const value = get(data, 'insert_end_customer.returning', [])
        setSearchText('')
        onEndCustomerUpdate(value[0].id)
      }
    }
  )

  const [updateEndCustomer] = useMutation(
    UPDATE_END_CUSTOMER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Saved!!')
        if (toggleDriver) {
          toggleDriver()
        }
      }
    }
  )

  const end_customer_data = get(_data, 'end_customer', null)

const onEndCustomerUpdate = id => {
    updateEndCustomer({
      variables: {
        trip_id: trip_info.id,
        end_customer_id: id,
        updated_by: context.email
      }
    })
  }

const onEndCustomerChange = (value) => {
    const end_customer = end_customer_data.find(_end_customer => _end_customer.name === value)
    if (end_customer) {
        onEndCustomerUpdate(end_customer.id)
    } else {
        insertEndCustomer({
        variables: {
          name: value
        }
      })
    }
  }

  let end_customers = []
  if (searchText && searchText.length >= 3) {
    end_customers = [{ id: 'new', name: searchText }]
  } else {
    end_customers = end_customer_data && end_customer_data.filter(_end_customer => _end_customer.name.indexOf(searchText) !== -1)
  }

  
  return (
    <Form.Item  name='end_customer' >
      <Select
        showSearch
        placeholder='Select or Enter End Customer Name'
        onSearch={onSearch}
        onChange={onEndCustomerChange}
        disabled={disable}
        size={size || 'middle'}
        style={{ width: '280%' }}
      >
          {end_customers && end_customers.map(_end_customer => (
          <Option key={_end_customer.id} value={_end_customer.name}>{_end_customer.name}</Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default EndCustomer
