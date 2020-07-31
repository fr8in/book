import { message } from 'antd'
import { useQuery, useMutation } from '@apollo/client'
import { TRUCKS_TYPE_QUERY } from './container/query/trucksTypeQuery'
import { UPDATE_TRUCK_TYPE_MUTATION } from './container/query/updateTruckTypeMutation'
import InlineSelect from '../common/inlineSelect'

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
    return { value: data.id, label: data.value }
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
