import { message, Select, Form } from 'antd'
import { useMutation, useSubscription, gql } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import get from 'lodash/get'

const { Option } = Select

const DRIVER_QUERY = gql`
subscription partner_driver($id:Int!){
    partner(where:{id:{_eq:$id}}){
      drivers{
        id
        mobile
      }
    }
  }`

const INSERT_PARTNER_DRIVER = gql`
mutation driver_insert($id: Int!, $mobile: String){
  insert_driver(objects:{partner_id: $id, mobile:$mobile}){
    returning{
      id
    }
  }
}`

const UPDATE_TRIP_DRIVER_MUTATION = gql`
mutation trip_driver($driver_id:Int,$trip_id:Int,$updated_by: String!,$truck_id:Int,$truck_driver_id:Int) {
  update_trip(_set: {driver_id: $driver_id,updated_by:$updated_by}, where: {id: {_eq: $trip_id}}){
    returning{
      id
    }
  }
update_truck(_set: {driver_id:$truck_driver_id,updated_by:$updated_by}, where: {id: {_eq: $truck_id}}){
    returning{
      id
    }
  }
}
`

const Driver = (props) => {
  const { trip_info, initialValue, disable, size, toggleDriver, nolabel } = props

  const partner_id = get(trip_info, 'partner.id', null)
  if (!partner_id) return null

  const [searchText, setSearchText] = useState('')
  const context = useContext(userContext)
  const onSearch = (value) => {
    setSearchText(value.substring(0, 10))
  }

  const { loading, error, data } = useSubscription(
    DRIVER_QUERY, {
      variables: { id: partner_id }
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
        const value = get(data, 'insert_driver.returning', [])
        setSearchText('')
        onDriverUpdate(value[0].id)
      }
    }
  )

  const [updateTripDriver] = useMutation(
    UPDATE_TRIP_DRIVER_MUTATION,
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

  const onDriverUpdate = id => {
    updateTripDriver({
      variables: {
        trip_id: trip_info.id,
        driver_id: id,
        updated_by: context.email,
        truck_id: trip_info.truck.id,
        truck_driver_id: id
      }
    })
  }

  const onDriverChange = (value) => {
    const driver = driver_data.find(_driver => _driver.mobile === value)
    if (driver) {
      onDriverUpdate(driver.id)
    } else {
      insertDriver({
        variables: {
          id: partner_id,
          mobile: value
        }
      })
    }
  }

  let drivers = []
  if (searchText && searchText.length >= 10) {
    drivers = [{ id: 'new', mobile: searchText }]
  } else {
    drivers = driver_data && driver_data.filter(_driver => _driver.mobile.indexOf(searchText) !== -1)
  }

  return (
    <Form.Item label={nolabel ? '' : 'Driver'} name='driver' initialValue={initialValue}>
      <Select
        showSearch
        placeholder='Select or Enter Driver'
        onSearch={onSearch}
        onChange={onDriverChange}
        disabled={disable}
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
