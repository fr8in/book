import { gql, useMutation } from '@apollo/client'
import { message } from 'antd'
import DateUpdater from '../common/dateUpdater'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'

const UPDATE_TRIP_SOURCEIN_MUTATION = gql`
mutation trip_source_in($source_in:timestamp,$id:Int,$updated_by: String!) {
    update_trip(_set: {source_in:$source_in,updated_by:$updated_by}, where: {id:{_eq:$id}}) {
      returning {
        id
        source_in
      }
    }
  }
`

const SourceInDate = (props) => {
  const { source_in, id, lock } = props

  const context = useContext(userContext)
  const [disableBtn, setDisableBtn] = useState(false)

  const [updateSourceIn] = useMutation(
    UPDATE_TRIP_SOURCEIN_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
        setDisableBtn(false)
      },
      onCompleted () {
        message.success('S-In Updated!')
        setDisableBtn(false)
      }
    }
  )

  const onSubmit = (dateString) => {
    setDisableBtn(true)
    updateSourceIn({
      variables: {
        id,
        source_in: dateString,
        updated_by: context.email
      }
    })
  }

  return (
    <DateUpdater
      name='source_in_date'
      label='Source In'
      dateValue={source_in}
      onSubmit={onSubmit}
      disable={disableBtn || lock}
    />
  )
}

export default SourceInDate
