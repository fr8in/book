import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import { message, DatePicker, Form } from 'antd'

const UPDATE_TRIP_DESTINATIONOUT_MUTATION = gql`
mutation tripDestinationOut($destination_out:timestamptz,$id:Int) {
    update_trip(_set: {destination_out:$destination_out}, where: {id:{_eq:$id}}) {
      returning {
        id
        destination_out
      }
    }
  }
`

const DestinationOutDate = (props) => {
  const { destination_out, id } = props

  const [updateDestinationOut] = useMutation(
    UPDATE_TRIP_DESTINATIONOUT_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const onSubmit = (date, dateString) => {
    console.log('fieldsValue', dateString)
    updateDestinationOut({
      variables: {
        id,
        destination_out: dateString
      }
    })
  }

  const dateFormat = 'DD-MM-YYYY HH:mm'

  return (
    <Form.Item name='destination_out_date' label='Destination Out'>
      <DatePicker
        showTime
        allowClear={false}
        format='DD-MM-YYYY HH:mm'
        placeholder='Select Time'
        style={{ width: '100%' }}
        disabled={!!destination_out}
        value={destination_out ? moment(destination_out, dateFormat) : null}
        onChange={onSubmit}
      />
    </Form.Item>
  )
}

export default DestinationOutDate
