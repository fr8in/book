import { message } from 'antd'
import { gql, useQuery, useMutation } from '@apollo/client'
import InlineSelect from '../common/inlineSelect'

const TRUCKS_TYPE_QUERY = gql`
  query truck_type{
  truck_type(where:{active:{_eq:true}}) {
      id
      name
  }
}
`
const UPDATE_TRUCK_TYPE_MUTATION = gql`
mutation truck_type_edit($truck_type_id:Int,$truck_no:String) {
    update_truck(_set:{truck_type_id: $truck_type_id}, where:{truck_no: {_eq:$truck_no}}) {
      returning{
        id
        truck_type_id
      }
    }
  }
`

const TruckType = (props) => {
  const { truckTypeId, truckType, truck_no } = props

  const { loading, error, data } = useQuery(
    TRUCKS_TYPE_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateTruckTypeId] = useMutation(
    UPDATE_TRUCK_TYPE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('TruckType error', error)

  const { truck_type } = data
  const truckList = truck_type.map(data => {
    return { value: data.id, label: data.name }
  })

  const onChange = (value) => {
    updateTruckTypeId({
      variables: {
        truck_no,
        truck_type_id: value
      }
    })
  }

  return (
    <InlineSelect
      label={truckType}
      value={truckTypeId}
      options={truckList}
      handleChange={onChange}
      style={{ width: 110 }}
    />
  )
}

export default TruckType
