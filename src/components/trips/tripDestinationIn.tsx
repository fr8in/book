import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'

const UPDATE_TRIP_DESTINATIONIN_MUTATION = gql`
mutation trip_destination_in($destination_in:timestamp,$id:Int) {
    update_trip(_set: {destination_in:$destination_in}, where: {id:{_eq:$id}}) {
      returning {
        id
        destination_in
      }
    }
  }
`

const DestinationInDate = (props) => {
  const { destination_in, id } = props

  const [updateDestinationIn] = useMutation(
    UPDATE_TRIP_DESTINATIONIN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (dateString) => {
    updateDestinationIn({
      variables: {
        id,
        destination_in: dateString
      }
    })
  }

  return (
    <DateUpdater
      name='destination_in_date'
      label='Destination In'
      dateValue={destination_in}
      onSubmit={onSubmit}
    />
  )
}

export default DestinationInDate
