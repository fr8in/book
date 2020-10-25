import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import get from 'lodash/get'

const UPDATE_TRIP_DESTINATIONOUT_MUTATION = gql`
mutation trip_destination_out($destination_out:timestamp,$id:Int,$updated_by: String!) {
    update_trip(_set: {destination_out:$destination_out,updated_by:$updated_by}, where: {id:{_eq:$id}}) {
      returning {
        id
        destination_out
      }
    }
  }
`

const DestinationOutDate = (props) => {
  const { destination_out, id, lock } = props

  const context = useContext(userContext)
  const [disableBtn, setDisableBtn] = useState(false)

  const [updateDestinationOut] = useMutation(
    UPDATE_TRIP_DESTINATIONOUT_MUTATION,
    {
      onError (error) {
        const msg = get(error, 'graphQLErrors[0].extensions.internal.error.message', error.toString())
        message.error(msg)
        setDisableBtn(false)
      },
      onCompleted () {
        message.success('D-Out Updated!')
        setDisableBtn(false)
      }
    }
  )

  const onSubmit = (dateString) => {
    setDisableBtn(true)
    updateDestinationOut({
      variables: {
        id,
        destination_out: dateString,
        updated_by: context.email
      }
    })
  }

  return (
    <DateUpdater
      name='destination_out_date'
      label='Destination Out'
      dateValue={destination_out}
      onSubmit={onSubmit}
      disable={disableBtn || lock}
    />
  )
}

export default DestinationOutDate
