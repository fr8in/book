import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const UPDATE_TRIP_DESTINATIONIN_MUTATION = gql`
mutation trip_destination_in($destination_in:timestamp,$id:Int,$updated_by: String!) {
    update_trip(_set: {destination_in:$destination_in,updated_by:$updated_by}, where: {id:{_eq:$id}}) {
      returning {
        id
        destination_in
      }
    }
  }
`

const DestinationInDate = (props) => {
  const { destination_in, id } = props

  const context = useContext(userContext)

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
        destination_in: dateString,
        updated_by: context.email
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
