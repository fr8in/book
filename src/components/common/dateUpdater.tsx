import moment from 'moment'
import { DatePicker, Form } from 'antd'
import isEmpty from 'lodash/isEmpty'

const DateUpdater = (props) => {
  const { name, label, dateValue, onSubmit, disable } = props

  const handleChange = (date, dateString) => {
    if (!isEmpty(dateString)) {
      onSubmit(dateString)
    }
  }
  return (
    <Form.Item
      name={name}
      label={label}
      initialValue={dateValue ? moment(dateValue) : null}
    >
      <DatePicker
        showTime
        allowClear
        format='YYYY-MM-DD HH:mm'
        placeholder='Select Time'
        style={{ width: '100%' }}
        disabled={!!dateValue || disable}
        onChange={handleChange}
        value={dateValue !== '' ? moment(dateValue) : null}
      />
    </Form.Item>
  )
}

export default DateUpdater
