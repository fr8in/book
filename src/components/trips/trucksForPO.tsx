import { Select, Form } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

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

const TrucksForPO = (props) => {
  const { partner_id, onChange } = props

  const { loading, error, data } = useQuery(
    TRUCKS_FOR_PO_QUERY,
    {
      variables: { id: partner_id },
      skip: !partner_id,
        fetchPolicy:"cache-and-network"
    }
  )

  console.log('TrucksForPO Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  console.log('TrucksForPO data', _data)
  const partner = get(_data, 'partner[0]', null)
  const truck_list = get(partner, 'trucks', [])

  const onTruckSelect = (value, Item) => {
    const selectd_truck = truck_list && truck_list.filter(t => t.id === parseInt(Item.key, 10))
    const truck = selectd_truck && selectd_truck.length > 0 && selectd_truck[0]
    onChange(truck, partner)
  }

  return (
    <Form.Item name='truck'>
      <Select
        placeholder='Select Truck'
        disabled={false}
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
