import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'

const UPDATE_TRIP_SOURCEOUT_MUTATION = gql`
mutation trip_source_out($source_out:timestamp,$id:Int) {
    update_trip(_set: {source_out:$source_out}, where: {id:{_eq:$id}}) {
      returning {
        id
        source_out
      }
    }
  }
`

const SourceOutDate = (props) => {
  const { source_out, id } = props
  console.log('s-out', source_out)
  const [updateSourceOut] = useMutation(
    UPDATE_TRIP_SOURCEOUT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (dateString) => {
    updateSourceOut({
      variables: {
        id,
        source_out: dateString
      }
    })
  }

  return (
    <DateUpdater
      name='source_out_date'
      label='Source Out'
      dateValue={source_out || null}
      onSubmit={onSubmit}
    />
  )
}

export default SourceOutDate
