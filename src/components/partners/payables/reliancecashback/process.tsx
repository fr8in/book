import { Modal, message, DatePicker, Space } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../../../lib/userContaxt'
import moment from 'moment'
import Loading from '../../../common/loading'
import now from 'lodash/now'

const process = 'RELIANCE_FUEL_CASHBACK'
const currentDate = moment().format('YYYYMMDD')
const period_status = 'Locked'

const GET_TOKEN_AND_CLOSING_PERIOD = gql`
query get_token${now()}($ref_id: Int!, $process: String!, $period_status: String!) {
  closing_period_status(period_status: $period_status) {
    period_status
    posting_from_date
    posting_to_date
  }
  token(ref_id: $ref_id, process: $process)
}
`

const process_cashback = gql`
mutation process_reliance_cashback($year:Int! ,$month:Int!,$created_by:String!,$posting_date:String!, $token:String!, $process:String!) {
  process_reliance_cashback(year: $year, month: $month, created_by: $created_by, posting_date: $posting_date,token:$token ,process:$process ) {
    status
    description
  }
}
`

const Process = (props) => {
  const { visible, title, onHide, month, year, setRelianceCashbackDetails } = props
  const [posting_date, setPosting_date] = useState(currentDate)

  const { loading, data, error } = useQuery(GET_TOKEN_AND_CLOSING_PERIOD, { variables: { ref_id: parseInt(currentDate), process, period_status }, fetchPolicy: 'network-only' })
  if (error) {
    message.error(error.message.toString())
  }

  const context = useContext(userContext)

  const [processCashback, { loading: mutationLoading }] = useMutation(
    process_cashback, {
      onError (error) {
        message.error(error.toString() || 'Error Occured!!')
        onHide()
      },
      onCompleted (data) {
        const status = get(data, 'process_reliance_cashback.status', null)
        if (status === 'OK') {
          message.success(get(data, 'process_reliance_cashback.description', 'Transaction Processed'))
          onHide()
          setRelianceCashbackDetails([])
        } else {
          message.error('Error Occured!!')
          onHide()
        }
      }
    })
  const disabledDate = (current) => {
    const closing_period = get(data, 'closing_period_status.posting_from_date', moment())
    const start = moment(closing_period, 'YYYY-MM-DD')
    return current < start || current > moment()
  }

  const onSubmit = () => {
    processCashback({ variables: { month, year, posting_date, created_by: context.email, token: data.token, process } })
  }
  const onChange = (date, dateString) => {
    setPosting_date(date.format('YYYYMMDD'))
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onHide}
      confirmLoading={loading}
      okText='Process'
      onOk={() => onSubmit()}
    >
      <Space>
        <label>PostingDate : </label>
        <DatePicker
          defaultValue={moment()} onChange={onChange}
          disabledDate={(current) => disabledDate(current)}
        />
      </Space>
      {(loading || mutationLoading) &&
        <Loading fixed />}
    </Modal>
  )
}

export default Process
