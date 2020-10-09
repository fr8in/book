import { message, DatePicker } from 'antd'
import { CloseCircleTwoTone, EditTwoTone } from '@ant-design/icons'
import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import useShowHide from '../../hooks/useShowHide'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'
import EditAccess from '../common/editAccess'

const UPDATE_CUSTOMER_EXCEPTION_MUTATION = gql`
mutation customer_exception($exception_date:timestamp,$cardcode:String,$updated_by:String!) {
  update_customer(_set: {exception_date: $exception_date,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      managed
    }
  }
}
`
const CustomerExceptionDate = (props) => {
  const { exceptionDate, cardcode ,edit_access} = props
  const context = useContext(userContext)

  const initial = { datePicker: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const [updateCustomerException] = useMutation(
    UPDATE_CUSTOMER_EXCEPTION_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const onChange = (date, dateString) => {
    console.log(dateString)
    updateCustomerException({
      variables: {
        cardcode,
        updated_by: context.email,
        exception_date: dateString
      }
    })
    onHide()
  }

  const dateFormat = 'YYYY-MM-DD'

  return (
    <div>
      {!visible.datePicker ? (
        <label>
          {exceptionDate ? moment(exceptionDate).format(dateFormat) : '-'}{' '}
          <EditAccess edit_access={edit_access} onEdit={() => onShow('datePicker')} />
        </label>)
        : (
          <span>
            <DatePicker
              showToday={false}
              placeholder='Exception Date'
              disabledDate={(current) => current && current < moment().startOf('days')}
              format={dateFormat}
              value={exceptionDate ? moment(exceptionDate, dateFormat) : null}
              onChange={onChange}
              size='small'
            />{' '}
            <CloseCircleTwoTone onClick={onHide} />
          </span>)}
    </div>
  )
}

export default CustomerExceptionDate
