import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { UPDATE_TRUCK_NO_MUTATION } from './container/query/updateTruckNoMutation'

const TruckNo = (props) => {
  const { truck_no, id } = props

console.log('id',id)
  const [updateTruckNo] = useMutation(
    UPDATE_TRUCK_NO_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onSubmit = (text) => {
    updateTruckNo({
      variables: {
        id,
        truck_no: text
      }
    })
  }

  return (
    <InlineEdit
      text={truck_no || 'No TruckNo'}
      onSetText={onSubmit}
    />
  )
}

export default TruckNo
