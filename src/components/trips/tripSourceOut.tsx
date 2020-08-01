import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import { message, DatePicker, Form } from 'antd'

const UPDATE_TRIP_SOURCEOUT_MUTATION = gql`
mutation tripSourceOut($source_out:timestamptz,$id:Int) {
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

  const [updateSourceOut] = useMutation(
    UPDATE_TRIP_SOURCEOUT_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onSubmit = (date, dateString) => {
    console.log('fieldsValue', dateString)
    updateSourceOut({
      variables: {
        id,
        source_out: dateString
      }
    })
  }

  const dateFormat = 'DD-MM-YYYY HH:mm'

  return (
    <Form.Item name='source_out_date' label='Source Out'>
      <DatePicker
        showTime
        allowClear={false}
        format='DD-MM-YYYY HH:mm'
        placeholder='Select Time'
        style={{ width: '100%' }}
        disabled={!!source_out}
        value={source_out ? moment(source_out, dateFormat) : null}
        onChange={onSubmit}
      />
    </Form.Item>
  )
}

export default SourceOutDate
