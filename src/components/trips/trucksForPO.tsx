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
      partner_users(where:{is_admin:{_eq:true}}){
        id
        mobile
      }
    }
  }
}

`

const TrucksForPO = (props) => {
  const { partner_id, onChange } = props

  const [truckSearch, setTruckSearch] = useState(null)

  const { loading, error, data } = useQuery(
    TRUCKS_FOR_PO_QUERY,
    {
      variables: {
        partner_id: partner_id || null,
        truck_search: truckSearch ? `%${truckSearch}%`:null
      },
      skip: !partner_id  && !truckSearch,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('TrucksForPO Error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }
  const truck_list = get(_data, 'truck', [])

  const onTruckSelect = (value, Item) => {
    let selected_truck;
    let truck;
    if (truck_list.length > 0) {
      selected_truck = truck_list && truck_list.filter(truck => truck.id === parseInt(Item.key, 10))
      truck = selected_truck && selected_truck.length > 0 && selected_truck[0]
    }
    onChange(truck)
  }
  const onTruckSearch = (value) => {
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
