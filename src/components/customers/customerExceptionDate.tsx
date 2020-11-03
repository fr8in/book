import { message, DatePicker } from 'antd'
import { CloseCircleTwoTone } from '@ant-design/icons'
import moment from 'moment'
import { gql, useMutation } from '@apollo/client'
import useShowHide from '../../hooks/useShowHide'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../lib/util'
import EditAccess from '../common/editAccess'

const UPDATE_CUSTOMER_EXCEPTION_MUTATION = gql`
mutation customer_exception($description: String, $topic: String, $customer_id: Int, $created_by: String,$exception_date:timestamp,$cardcode:String,$updated_by:String!) {
  insert_customer_comment(objects: {description: $description, customer_id: $customer_id, topic: $topic, created_by: $created_by}) {
    returning {
      description
    }
  }
  update_customer(_set: {exception_date: $exception_date,updated_by:$updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      managed
    }
  }
}
  
`
const CustomerExceptionDate = (props) => {
  const { exceptionDate, cardcode ,edit_access,customer_id} = props
  const context = useContext(userContext)
  const { topic } = u

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
    updateCustomerException({
      variables: {
        cardcode,
        updated_by: context.email,
        exception_date: dateString,
        created_by: context.email,
        description:`${topic.customer_exception} updated by ${context.email}`,
        topic:topic.customer_exception,
        customer_id: customer_id
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
