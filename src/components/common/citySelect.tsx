import { Select, Form } from 'antd'
import { useMutation, gql } from '@apollo/client'

const { Option } = Select

const CITY_SEARCH = gql`
mutation citySearchMutation($searchText:String!) 
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
const CitySelect = (props) => {
  const { onChange, label, disabled, city } = props

  const [citySearchMutation, { data }] = useMutation(
    CITY_SEARCH
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

  const citySearch = data ? data.citySearch : []
  const formatCity = (_city) => _city ? `${_city.name} , ${_city.stateName}` : null

  return (
    <Form.Item label={label}>
      <Select
        showSearch
        placeholder={label}
        defaultValue={formatCity(city)}
        onSearch={onSearch}
        disabled={disabled}
        onChange={onChange}
      >
        {citySearch.map(_city => (
          <Option key={_city.id} value={formatCity(_city)}>{formatCity(_city)}</Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default CitySelect
