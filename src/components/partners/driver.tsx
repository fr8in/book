import { message, Select, Form } from 'antd'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useState } from 'react'
import _ from 'lodash'

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
  const { partner_id } = props
  if (!partner_id) return null

  const [searchText, setSearchText] = useState('')
  const onSearch = (value) => {
    setSearchText(value.substring(0, 10))
  }

  const { loading, error, data } = useQuery(
    DRIVER_QUERY, { variables: { id: partner_id } }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }

  console.log('Driver error', error)
  console.log('data', _data)
  const driver_data = _data && _data.partner && _data.partner.length > 0 &&
                        _data.partner[0].drivers && _data.partner[0].drivers.length > 0
    ? _data.partner[0].drivers : []

  const [insertDriver] = useMutation(
    INSERT_PARTNER_DRIVER,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        setSearchText('')
      }
    }
  )
  const onDriverChange = value => {
    const isNew = driver_data && driver_data.filter(_driver => _driver.mobile.search(value) !== -1)
    console.log('mobile', value, (_.isEmpty(isNew)))
    if ((_.isEmpty(isNew))) {
      insertDriver({
        variables: {
          id: partner_id,
          mobile: value
        }
      })
    } else return null
  }

  let drivers = []
  if (searchText && searchText.length >= 10) {
    drivers = [{ id: searchText, mobile: searchText }]
  } else {
    drivers = driver_data && driver_data.filter(_driver => _driver.mobile.search(searchText) !== -1)
  }
  console.log('drivers', drivers)
  return (
    <Form.Item label='Driver' name='driver'>
      <Select
        showSearch
        onSearch={onSearch}
        onChange={onDriverChange}
      >
        {drivers && drivers.map(_driver => (
          <Option key={_driver.id} value={_driver.mobile}>{_driver.mobile}</Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default Driver
