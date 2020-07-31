import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import { message, DatePicker, Form, Button } from 'antd'

const UPDATE_TRIP_SOURCEIN_MUTATION = gql`
mutation tripSourceIn($source_in:timestamptz,$id:Int) {
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
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onSubmit = (date, dateString) => {
    console.log('fieldsValue', dateString)
    updateSourceIn({
      variables: {
        id,
        source_in: dateString
      }
    })
  }

  const dateFormat = 'DD/MM/YY HH:mm'
  const s_in = moment(source_in).format(dateFormat)
  console.log('s_in', s_in)

  return (
    <Form.Item name='source_in_date' label='Source In'>
      <DatePicker
        showTime
        allowClear={false}
        format='YYYY-MM-DD HH:mm:ss'
        placeholder='Select Time'
        style={{ width: '100%' }}
        disabled={!!source_in}
        value={source_in ? moment(source_in, dateFormat) : null}
        onChange={onSubmit}
      />
    </Form.Item>
  )
}

export default SourceInDate
