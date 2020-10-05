import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

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
  const { destination_out, id } = props

  const context = useContext(userContext)

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
    />
  )
}

export default DestinationOutDate
