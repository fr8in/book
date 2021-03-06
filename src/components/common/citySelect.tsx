import { Select, Form, message } from 'antd'
import { useMutation, gql } from '@apollo/client'
import get from 'lodash/get'

const CITY_SEARCH = gql`
mutation city_search_mutation($searchText:String!) 
{
  citySearch(searchText:$searchText) {
    id
    name
    longitude
    latitude
    stateId
    stateName
  }
}
`
const INSERT_CITY = gql`
mutation insert_city($name: String, $location: point) {
  insert_city(objects: {name: $name, location: $location}) {
    returning {
      id
      location
      name
    }
  }
}
`
const CitySelect = (props) => {
  const { onChange, label, disabled, city, required, name, width, size, style } = props

  const [citySearchMutation, { data }] = useMutation(
    CITY_SEARCH
  )

  const [insertCityMutation] = useMutation(
    INSERT_CITY,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted (data) {
        const value = get(data, 'insert_city.returning', [])
        // message.success('Updated!!')
        onChange(value[0].id)
      }
    }
  )

  const onSearch = (searchText) => {
    if (searchText.length >= 3) {
      citySearchMutation({
        variables: {
          searchText
        }
      })
    } else return null
  }

  const insertCity = (data) => {
    insertCityMutation(
      {
        variables: { name: data.name, location: data.location }
      }
    )
  }

  const onCityChange = (city, value) => {
    const id = isNaN(value.key)
    const selectedCity = citySearch.filter(city => city.id === value.key)
    if (id) {
      insertCity({
        name: selectedCity[0].name,
        location: `${selectedCity[0].latitude},${selectedCity[0].longitude}`
      })
    } else {
      onChange(value.key)
    }
  }

  const citySearch = data ? data.citySearch : []
  const formatCity = (_city) => _city ? `${_city.name}, ${_city.stateName}` : null

  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required }]}
      initialValue={city}
      className={style || ''}
    >
      <Select
        showSearch
        placeholder={label || 'Select City'}
        onSearch={onSearch}
        disabled={disabled}
        onChange={(city, value) => onCityChange(city, value)}
        style={{ width: width || '100%' }}
        size={size || 'middle'}
      >
        {citySearch.map(_city => (
          <Select.Option key={_city.id} value={formatCity(_city)}>{formatCity(_city)}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default CitySelect
