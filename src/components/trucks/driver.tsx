import { message, Select, Form } from 'antd'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useState,useContext } from 'react'
import userContext from '../../lib/userContaxt'
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
mutation truck_driver_insert($id: Int!, $mobile: String){
  insert_driver(objects:{partner_id: $id, mobile:$mobile}){
    returning{
      id
    }
  }
}`

const UPDATE_TRUCK_DRIVER_MUTATION = gql`
mutation truck_driver_update($driver_id:Int,$truck_id:Int,$updated_by: String!) {
  update_truck(_set: {driver_id: $driver_id,updated_by:$updated_by}, where: {id: {_eq: $truck_id}}){
    returning{
      id
    }
  }
}
`

const Driver = (props) => {
  const { partner_id, driverChange, initialValue , truck_id } = props
  if (!partner_id) return null

  const [searchText, setSearchText] = useState('')
  const context = useContext(userContext)
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
        const value = get(data, 'insert_driver.returning', [])
        setSearchText('')
        truck_id ? onDriverUpdate(value[0].id) : driverChange(value[0].id)
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
    updateTruckDriver({
      variables: {
        truck_id: truck_id,
        driver_id: id,
        updated_by: context.email
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
      truck_id ? onDriverUpdate(driver.key) : driverChange(driver.key)
    }
  }

  let drivers = []
  if (searchText && searchText.length >= 10) {
    drivers = [{ id: searchText, mobile: searchText }]
  } else {
    drivers = driver_data && driver_data.filter(_driver => _driver.mobile.search(searchText) !== -1)
  }
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
