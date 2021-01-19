import { Select, Form } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import { useState } from 'react'


const TRUCKS_FOR_PO_QUERY = gql`
query trucks_for_po($partner_id: Int, $truck_search: String) {
  truck(where: {partner_id: {_eq: $partner_id}, truck_status: {name: {_eq: "Waiting for Load"}}, truck_no: {_ilike: $truck_search}}) {
    id
    truck_no
    truck_type {
      id
      name
    }
    partner {
      name
      id
    }
  }
}
`

const TrucksForPO = (props) => {
  const { partner_id, onChange } = props

  const [truckSearch, setTruckSearch] = useState(null)
  console.log('partner_id', partner_id,'!partner_id', !partner_id,'truckSearch', truckSearch,'!truckSearch',!truckSearch)

  const { loading, error, data } = useQuery(
    TRUCKS_FOR_PO_QUERY,
    {
      variables: {
        partner_id: partner_id || null,
        truck_search: truckSearch 
      },
      skip: !partner_id ,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('TrucksForPO Error', error)
  console.log('TrucksForPO data', data)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const [form] = Form.useForm()

  
  const truck_list = get(_data, 'truck', [])
console.log('truck_list',truck_list)
  const onTruckSelect = (value, Item) => {
    let selected_truck;
    let truck;
    if (truck_list.length > 0) {
      selected_truck = truck_list && truck_list.filter(truck => truck.id === parseInt(Item.key, 10))
      truck = selected_truck && selected_truck.length > 0 && selected_truck[0]
    }
     else if (truckSearch.length > 0) {
      selected_truck = truckSearch && truckSearch.filter(truck => truck.id === parseInt(Item.key, 10))
      truck = selected_truck && selected_truck.length > 0 && selected_truck[0]
    }
    console.log('truck',truck)
    onChange(truck)
  }
  const onTruckSearch = (value) => {
    console.log('value',value)
    setTruckSearch(value)
  }
  return (
    <Form.Item name='truck'>
      <Select
        placeholder='Select Truck'
        disabled={false}
        showSearch
        onSearch={onTruckSearch}
        onChange={onTruckSelect}
      >
        {truck_list && truck_list.map(_truck => (
          <Select.Option key={_truck.id} value={_truck.truck_no}>{_truck.truck_no}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default TrucksForPO
