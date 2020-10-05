import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const UPDATE_TRIP_SOURCEOUT_MUTATION = gql`
mutation trip_source_out($source_out:timestamp,$id:Int,$updated_by: String!) {
    update_trip(_set: {source_out:$source_out,updated_by:$updated_by}, where: {id:{_eq:$id}}) {
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

  const context = useContext(userContext)

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
        source_out: dateString,
        updated_by: context.email
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
