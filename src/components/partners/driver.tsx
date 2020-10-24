import { message, Select, Form } from 'antd'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useState } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const { Option } = Select

const DRIVER_QUERY = gql`
query partner_driver($id:Int!){
    partner(where:{id:{_eq:$id}}){
      drivers{
        id
        mobile
      }
    }
  }`

const INSERT_PARTNER_DRIVER = gql`
mutation driver_insert($id: Int!, $mobile: String){
  insert_driver(objects:{partner_id: $id, mobile:$mobile }){
    returning{
      id
    }
  }
}`

const Driver = (props) => {
  const { partner_id, driver_id, required, size, style } = props
  if (!partner_id) return null

  const [searchText, setSearchText] = useState('')
  const onSearch = (value) => {
    setSearchText(value.substring(0, 10))
  }

  const { loading, error, data } = useQuery(
    DRIVER_QUERY, {
      variables: { id: partner_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }

  console.log('Driver error', error)
  const driver_data = get(_data, 'partner[0].drivers', [])

  const [insertDriver] = useMutation(
    INSERT_PARTNER_DRIVER,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        console.log('driver data', data)
        const id = get(data, 'insert_driver.returning[0].id', null)
        message.success('Updated!!')
        driver_id(id)
        setSearchText('')
      }
    }
  )
  const onDriverChange = (value, option) => {
    console.log('driver option', option)
    const isNew = driver_data && driver_data.filter(_driver => _driver.mobile.search(value) !== -1)
    console.log('mobile', value, (isEmpty(isNew)))
    if ((isEmpty(isNew))) {
      insertDriver({
        variables: {
          id: partner_id,
          mobile: value
        }
      })
    } else { driver_id(option.key) }
  }

  let drivers = []
  if (searchText && searchText.length >= 10) {
    drivers = [{ id: searchText, mobile: searchText }]
  } else {
    drivers = driver_data && driver_data.filter(_driver => _driver.mobile.search(searchText) !== -1)
  }
  return (
    <Form.Item label='Driver' name='driver' rules={[{ required: required }]} className={style || ''}>
      <Select
        showSearch
        placeholder='Select Driver...'
        onSearch={onSearch}
        onChange={onDriverChange}
        size={size || 'middle'}
      >
        {drivers && drivers.map(_driver => (
          <Option key={_driver.id} value={_driver.mobile}>{_driver.mobile}</Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default Driver
