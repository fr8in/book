import { useState } from 'react'
import { message, DatePicker } from 'antd'
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons'
import moment from 'moment'
import { UPDATE_CUSTOMER_EXCEPTION_MUTATION } from './containers/query/updateCustomerExceptionMutation'
import { useMutation } from '@apollo/client'
import useShowHide from '../../hooks/useShowHide'

const CustomerExceptionDate = (props) => {
  const { exceptionDate, cardcode } = props

  const initial = { datePicker: false }
  const { visible, onHide, onShow } = useShowHide(initial)

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
    onHide()
  }

  const dateFormat = 'YYYY-MM-DD'

  return (
    <div>
      {!visible.datePicker ? (
        <label>
          {exceptionDate ? moment(exceptionDate).format(dateFormat) : '-'}
          <EditOutlined onClick={() => onShow('datePicker')} />
        </label>)
        : (
          <span>
            <DatePicker
              showToday={false}
              placeholder='Exception Date'
              disabled={false}
              format={dateFormat}
              value={exceptionDate ? moment(exceptionDate, dateFormat) : moment()}
              onChange={onChange}
            />
            <CloseCircleOutlined onClick={onHide} />
          </span>)}
    </div>
  )
}

export default CustomerExceptionDate
