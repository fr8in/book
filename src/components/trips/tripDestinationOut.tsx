import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'

const UPDATE_TRIP_DESTINATIONOUT_MUTATION = gql`
mutation trip_destination_out($destination_out:timestamptz,$id:Int) {
    update_trip(_set: {destination_out:$destination_out}, where: {id:{_eq:$id}}) {
      returning {
        id
        destination_out
      }
    }
  }
`

const DestinationOutDate = (props) => {
  const { destination_out, id } = props

  const [updateDestinationOut] = useMutation(
    UPDATE_TRIP_DESTINATIONOUT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (dateString) => {
    updateDestinationOut({
      variables: {
        id,
        destination_out: dateString
      }
    })
  }

  return (
    <DateUpdater
      name='destination_out_date'
      label='Destination Out'
      dateValue={destination_out}
      onSubmit={onSubmit}
    />
  )
}

export default DestinationOutDate
