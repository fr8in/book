import { useState } from 'react'
import { message, DatePicker } from 'antd'
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons'
import moment from 'moment'
import { UPDATE_CUSTOMER_EXCEPTION_MUTATION } from './containers/query/updateCustomerExceptionMutation'
import { useMutation } from '@apollo/client'

const CustomerExceptionDate = (props) => {
  const { exceptionDate, cardcode } = props

  const [edit, setEdit] = useState(false)

  const [updateCustomerException] = useMutation(
    UPDATE_CUSTOMER_EXCEPTION_MUTATION,
    {
      onError (error) { message.error(error.toString()) }
    }
  )
  const onChange = (date, dateString) => {
    console.log(dateString)
    updateCustomerException({
      variables: {
        cardcode,
        exception_date: dateString.toString()
      }
    })
    setEdit(false)
  }

  const handleShow = () => {
    setEdit(true)
  }
  const handleClose = () => {
    setEdit(false)
  }

  const dateFormat = 'YYYY-MM-DD'
  return (
    <div>
      {!edit ? (
        <label>
          {exceptionDate ? moment(exceptionDate).format(dateFormat) : '-'}
          <EditOutlined onClick={handleShow} />
        </label>)
        : (
          <span>
            <DatePicker
              showToday={false}
              placeholder='Exception Date'
              disabled={false}
              format={dateFormat}
              value={moment(exceptionDate, dateFormat)}
              onChange={onChange}
            />
            <CloseCircleOutlined onClick={handleClose} />
          </span>)}
    </div>
  )
}

export default CustomerExceptionDate
