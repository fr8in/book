import { useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'

const UPDATE_TRIP_DESTINATIONIN_MUTATION = gql`
mutation trip_destination_in($destination_in:timestamp,$id:Int,$updated_by: String!) {
  update_trip(_set: {destination_in:$destination_in,updated_by:$updated_by}, where: {id:{_eq:$id}}) {
    returning {
      id
      destination_in
    }
  }
}`

const DestinationInDate = (props) => {
  const { destination_in, id, advance_processed, lock } = props

  const context = useContext(userContext)
  const [disableBtn, setDisableBtn] = useState(false)

  const [updateDestinationIn] = useMutation(
    UPDATE_TRIP_DESTINATIONIN_MUTATION,
    {
      onError (error) {
        const msg = get(error, 'graphQLErrors[0].extensions.internal.error.message', error.toString())
        message.error(msg)
        setDisableBtn(false)
      },
      onCompleted () {
        message.success('D-In Updated!')
        setDisableBtn(false)
      }
    }
  )

  const onSubmit = (dateString) => {
    if (advance_processed) {
      setDisableBtn(true)
      updateDestinationIn({
        variables: {
          id,
          destination_in: dateString,
          updated_by: context.email
        }
      })
    } else {
      message.error('Advance not processed!')
    }
  }

  return (
    <DateUpdater
      name='destination_in_date'
      label='Destination In'
      dateValue={destination_in}
      onSubmit={onSubmit}
      disable={disableBtn || lock}
    />
  )
}

export default DestinationInDate
