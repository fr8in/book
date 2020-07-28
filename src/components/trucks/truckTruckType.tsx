import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_TRUCK_TRUCKTYPE_MUTATION } from './container/query/updateTruckTruckTypeMutation'

const truckTruckType = (props) => {
  const { truck_no, truck_type_id } = props

  const [updateTruckTruckType] = useMutation(
    UPDATE_TRUCK_TRUCKTYPE_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onSubmit = (text) => {
    updateTruckTruckType({
      variables: {
        truck_no,
        truck_type_id: text
      }
    })
  }

  return (
    <InlineEdit
      text={truck_type_id || 'No Trucktype'}
      onSetText={onSubmit}
    />
  )
}

export default truckTruckType
