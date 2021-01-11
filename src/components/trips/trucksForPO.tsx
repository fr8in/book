import { Select, Form } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import { useState } from 'react'


const TRUCKS_FOR_PO_QUERY = gql`
query partner_po_creation($id:Int!){
  partner(where:{id:{_eq:$id}}){
    id
    cardcode
    name
    trucks(where:{truck_status:{name:{_eq:"Waiting for Load"}}}){
      id
      truck_no
      truck_type{
        id
        name
      }
    }
  }
}`

const TRUCKS_SEARCH_QUERY = gql `query truck_search($search: String){
  search_truck(args:{search:$search, status_ids: "{5}"}){
      id
      link
      description
    }
  }`

const TrucksForPO = (props) => {
  const { partner_id, onChange } = props
  const initial = { search: null }
  const [obj, setObj] = useState(initial)


  const { loading:truck_loading, error:truck_error, data:truck_data } = useQuery(
    TRUCKS_SEARCH_QUERY,
    {
      variables: { search: obj.search || '' },
      skip: !obj.search,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _truck_data = {}
  if (!truck_loading) {
    _truck_data = truck_data
  }
  const truckSearch = get(_truck_data, 'search_truck', [])

  const { loading, error, data } = useQuery(
    TRUCKS_FOR_PO_QUERY,
    {
      variables: { id: partner_id },
      skip: !partner_id,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('TrucksForPO Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const [form] = Form.useForm()

  const partner = get(_data, 'partner[0]', null)
  const truck_list = get(partner, 'trucks', [])

  const onTruckSelect = (value, Item) => {
    let selectd_truck;
    let truck;
  if(truck_list.length > 0){
    selectd_truck = truck_list && truck_list.filter(t => t.id === parseInt(Item.key, 10))
    truck = selectd_truck && selectd_truck.length > 0 && selectd_truck[0] 
  } else if(truckSearch.length > 0) {
    selectd_truck = truckSearch && truckSearch.filter(t => t.id === parseInt(Item.key, 10))
    truck = selectd_truck && selectd_truck.length > 0 && selectd_truck[0] 
  }
    onChange(truck, partner)
    //form.resetFields(['partner'])
  }
  const onTruckSearch = (value) => {
    setObj({ ...obj, search: value })
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
        {truckSearch && truckSearch.map(_part => (
                <Select.Option key={_part.id} value={_part.description}>{_part.description}</Select.Option>
              ))}
      </Select>
    </Form.Item>
  )
}

export default TrucksForPO
