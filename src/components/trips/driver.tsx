import { message, Select, Form } from 'antd'
import { useMutation, gql } from '@apollo/client'
import { useState } from 'react'

const { Option } = Select;

const UPDATE_TRIP_DRIVER = gql`
mutation updateTripDriver($trip_id:Int!,$driver:String) {
  update_trip_by_pk(pk_columns: {id: $trip_id}, _set: {driver: $driver}) {
    id
  }

}
`
const Driver = (props) => {
  const { tripInfo } = props
  if (!tripInfo.id) return null

  const [searchText, setSearchText] = useState('')
  const onSearch = (value) => {
      setSearchText(value.substring(0,10))
  }

  const { partner, driver, id } = tripInfo

  const [updateTripDriver] = useMutation(
    UPDATE_TRIP_DRIVER,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const onDriverChange = value => {
    setSearchText('')
    updateTripDriver({
      variables: {
        trip_id: id,
        driver: value
      }
    })
  }

  let drivers = []
  if (searchText && searchText.length >= 10) {
    drivers =[{ id: searchText, mobile: searchText }]
  }
  else {
    drivers = partner?.drivers.filter(_driver => _driver.mobile.search(searchText) !== -1)
  }

  return (
    <Form.Item label='Driver'>
      <Select
        showSearch
        defaultValue={driver}
        onSearch={onSearch}
        onChange={onDriverChange}
        style={{width: '100%'}}
      >
        {drivers.map(_driver => (
          <Option key={_driver.id} value={_driver.mobile}>{_driver.mobile}</Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default Driver