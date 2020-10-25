import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import get from 'lodash/get'

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
  const { source_out, id, lock } = props

  const context = useContext(userContext)
  const [disableBtn, setDisableBtn] = useState(false)

  const [updateSourceOut] = useMutation(
    UPDATE_TRIP_SOURCEOUT_MUTATION,
    {
      onError (error) {
        const msg = get(error, 'graphQLErrors[0].extensions.internal.error.message', error.toString())
        message.error(msg)

        setDisableBtn(false)
      },
      onCompleted () {
        message.success('S-Out Updated!')
        setDisableBtn(false)
      }
    }
  )

  const onSubmit = (dateString) => {
    setDisableBtn(true)
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
      disable={disableBtn || lock}
    />
  )
}

export default SourceOutDate
