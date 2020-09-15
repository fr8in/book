import { message, Select, Form } from 'antd'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useState } from 'react'
import get from 'lodash/get'
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

const UPDATE_TRUCK_DRIVER_MUTATION = gql`
mutation TripDriver($driver_id:Int,$trip_id:Int) {
  update_trip(_set: {driver_id: $driver_id}, where: {id: {_eq: $trip_id}}){
    returning{
      id
    }
  }
}
`

const Driver = (props) => {
  const { trip_info , initialValue } = props

  const partner_id = trip_info && trip_info.partner && trip_info.partner.id

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

  const driver_data = get(_data, 'partner[0].drivers', [])

  console.log('driver_data', driver_data)

  const [insertDriver] = useMutation(
    INSERT_PARTNER_DRIVER,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const value = get(data, 'insert_driver.returning', [])
        setSearchText('')
        onDriverUpdate(value[0].id)
      }
    }
  )

  const [updateTruckDriver] = useMutation(
    UPDATE_TRUCK_DRIVER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onDriverUpdate = id => {
    console.log('trip_info.id', trip_info.id)
    updateTruckDriver({
      variables: {
        trip_id: trip_info.id,
        driver_id: id
      }
    })
  }

  const onDriverChange = (value, driver) => {
    const isNew = driver_data && driver_data.filter(_driver => _driver.mobile.search(value) !== -1)
    console.log('mobile', value, driver, (_.isEmpty(isNew)))
    if ((_.isEmpty(isNew))) {
      insertDriver({
        variables: {
          id: partner_id,
          mobile: value
        }
      })
    } else {
      onDriverUpdate(driver.key)
    }
  }

  let drivers = []
  if (searchText && searchText.length >= 10) {
    drivers = [{ id: searchText, mobile: searchText }]
  } else {
    drivers = driver_data && driver_data.filter(_driver => _driver.mobile.search(searchText) !== -1)
  }
  console.log('drivers', drivers)
  return (
    <Form.Item label='Driver' name='driver' initialValue={initialValue}>
      <Select
        showSearch
        placeholder='Select or Enter Driver'
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
