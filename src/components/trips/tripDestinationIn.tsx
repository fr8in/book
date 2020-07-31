import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import { message, DatePicker, Form } from 'antd'

const UPDATE_TRIP_DESTINATIONIN_MUTATION = gql`
mutation tripDestinationIn($destination_in:timestamptz,$id:Int) {
    update_trip(_set: {destination_in:$destination_in}, where: {id:{_eq:$id}}) {
      returning {
        id
        destination_in
      }
    }
  }
`

const DestinationInDate = (props) => {
  const { destination_in, id } = props

  const [updateDestinationIn] = useMutation(
    UPDATE_TRIP_DESTINATIONIN_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onSubmit = (date, dateString) => {
    console.log('fieldsValue', dateString)
    updateDestinationIn({
      variables: {
        id,
        destination_in: dateString
      }
    })
  }

  const dateFormat = 'DD-MM-YYYY HH:mm'

  return (
    <Form.Item name='destination_in_date' label='Destination In'>
      <DatePicker
        showTime
        allowClear={false}
        format='DD-MM-YYYY HH:mm'
        placeholder='Select Time'
        style={{ width: '100%' }}
        disabled={!!destination_in}
        value={destination_in ? moment(destination_in, dateFormat) : null}
        onChange={onSubmit}
      />
    </Form.Item>
  )
}

export default DestinationInDate
