import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'

const UPDATE_TRIP_SOURCEIN_MUTATION = gql`
mutation trip_source_in($source_in:timestamp,$id:Int) {
    update_trip(_set: {source_in:$source_in}, where: {id:{_eq:$id}}) {
      returning {
        id
        source_in
      }
    }
  }
`

const SourceInDate = (props) => {
  const { source_in, id } = props

  const [updateSourceIn] = useMutation(
    UPDATE_TRIP_SOURCEIN_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
      }
    }
  )

  const onSubmit = (dateString) => {
    updateSourceIn({
      variables: {
        id,
        source_in: dateString
      }
    })
  }

  return (
    <DateUpdater
      name='source_in_date'
      label='Source In'
      dateValue={source_in}
      onSubmit={onSubmit}
    />
  )
}

export default SourceInDate
