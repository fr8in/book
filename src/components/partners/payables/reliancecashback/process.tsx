import { Modal, Form, Input, message, Button, DatePicker } from 'antd';
import { useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../../../lib/userContaxt'
import moment from 'moment';


const process_cashback = gql`
mutation process_reliance_cashback($year:Int! ,$month:Int!,$created_by:String!,$posting_date:String!  ) {
  process_reliance_cashback(year: $year, month: $month, created_by: $created_by, posting_date: $posting_date) {
    status
    description
  }
}
`

const Process = (props) => {
  const { visible, title, month, year } = props
  const [disableButton, setDisableButton] = useState(false)
  const [posting_date, setPosting_date] = useState(null)

  const context = useContext(userContext)

  const [processCashback] = useMutation(
    process_cashback, {
    onError(error) {
      setDisableButton(false)
      message.error(error.toString())
    },
    onCompleted(data) {
      const status = get(data, 'process_reliance_cashback.success', null)
      if (status) {
        message.success(get(data, 'process_reliance_cashback.message', 'Processed!!'))
        setDisableButton(false)
      } else {
        setDisableButton(false)
        message.error(get(data, 'process_reliance_cashback.message', 'Error Occured!!'))
      }
    }
  })

  const onSubmit = () => {
    console.log('cashBackParams - ', month, year, posting_date)
    processCashback({ variables: { month, year, posting_date,created_by: context.email } })
  }
  const onChange = (date, dateString) => {
    setPosting_date(dateString)
  }

  const dateFormat = 'YYYY-MM-DD';

  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
    >
        PostingDate : <DatePicker defaultValue={moment(dateFormat)} onChange={onChange} />

      <Button type='primary'
        size='middle'
        loading={disableButton}
        htmlType='submit'
        onClick={() => onSubmit()
       } >Submit</Button>
    </Modal>
  )
}

export default Process
