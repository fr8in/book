import { Modal, Form, Input, message, Button, DatePicker } from 'antd';
import { useState, useContext } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../../../lib/userContaxt'
import moment from 'moment';
import Loading from '../../../common/loading'

const process = 'RELIANCE_FUEL_CASHBACK'
const currentDate = moment().format('YYYYMMDD')

const GET_TOKEN = gql`
query get_token (
  $ref_id: Int!,
  $process:String!
){
  token(ref_id: $ref_id, process:$process )
}`

const process_cashback = gql`
mutation process_reliance_cashback($year:Int! ,$month:Int!,$created_by:String!,$posting_date:String!, $token:String!, $process:String!) {
  process_reliance_cashback(year: $year, month: $month, created_by: $created_by, posting_date: $posting_date,token:$token ,process:$process ) {
    status
    description
  }
}
`


const Process = (props) => {

  const { visible, title, onHide, month, year } = props

  const [posting_date, setPosting_date] = useState(currentDate)

  const { loading, data, error } = useQuery(GET_TOKEN, { variables: { ref_id: parseInt(currentDate), process }, fetchPolicy: 'network-only' })

  const context = useContext(userContext)

  const [processCashback,{ loading: mutationLoading }] = useMutation(
    process_cashback, {
    onError(error) {
      message.error(`Error Occured!!`)
      onHide()
    },
    onCompleted(data) {
      const status = get(data, 'process_reliance_cashback.success', null)
      if (status) {
        message.success(get(data, 'process_reliance_cashback.message', 'Processed!!'))
        onHide()
      } else {
        message.error(`Error Occured!!`)
        onHide()
      }
    }
  })


  const onSubmit = () => {

    processCashback({ variables: { month, year, posting_date, created_by: context.email,token:data.token , process  } })

  }
  const onChange = (date, dateString) => {
    console.log('dateString', date)
    setPosting_date(date.format('YYYYMMDD'))
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onHide}
      confirmLoading={loading}
      okText={'Process'}
      onOk={() => onSubmit()}
    >
      PostingDate : <DatePicker defaultValue={moment()} onChange={onChange} />
      {(loading || mutationLoading) &&
        <Loading fixed />}
    </Modal>
  )
}

export default Process
