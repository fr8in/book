import { Modal, Form, Input, message, Button } from 'antd'
import { useState, useContext } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import Loading from '../../common/loading'
import u from '../../../lib/util'
import userContext from '../../../lib/userContaxt'
import moment from 'moment'
const GET_TOKEN = gql`
query get_token($trip_id: Int!) {
  token(ref_id: $trip_id, process:"INCENTIVE_TRACK")
}
`

const REJECT_INCENTIVE_MUTATION = gql`
mutation delete_incentive($id: Int!, $approved_by:String,$approved_at:timestamp) {
  update_incentive(where: {id: {_eq: $id}}, _set: {status_id:3,approved_by:$approved_by,approved_at:$approved_at,is_scratched:true}) {
    returning {
      id
    }
  }
}
`

const INCENTIVE_APPROVAL_MUTATION = gql`
mutation approve_incentive($id: Int!, $approved_by: String!,$process:String!,$token:String!) {
  approve_incentive(id: $id, approved_by: $approved_by, process: $process, token:$token ) {
    description
    status
  }
}
`

const IncentiveApprove = (props) => {
  const { visible, onHide, item_id, title, setIncentiveRefetch, trip_id, edit_access } = props
  const { role } = u
  const context = useContext(userContext)
  const incentive_approval_access = [role.admin]
  const incentive_access = u.is_roles(incentive_approval_access, context)
  const [disableButton, setDisableButton] = useState(false)
  const { loading, data, error } = useQuery(GET_TOKEN, { variables: { trip_id: parseInt(trip_id) }, fetchPolicy: 'network-only' })

  if (error) {
    message.error(error.toString())
    onHide()
  }

  const [rejectIncentive] = useMutation(
    REJECT_INCENTIVE_MUTATION, {
    onError(error) {
      setDisableButton(false)
      message.error(error.toString())
      onHide()
    },
    onCompleted() {
      setDisableButton(false)
      message.success('Rejected!!')
      onHide()
    }
  })

  const [incentiveApproval,{ loading: mutationLoading }] = useMutation(
    INCENTIVE_APPROVAL_MUTATION,
    {
      onError(error) {
        setDisableButton(false)
        message.error(error.toString())
        onHide()
      },
      onCompleted(data) {
        const status = get(data, 'approve_incentive.status', null)
        const description = get(data, 'approve_incentive.description', null)
        if (status === 'OK') {
          setDisableButton(false)
          setIncentiveRefetch(true)
          onHide()
          message.success("Approved!!")
        } else {
          message.error(description)
          setDisableButton(false)
          onHide()
        }
      }
    })

  const onSubmit = (form) => {
    if (title === 'Approve') {
      setDisableButton(true)
      incentiveApproval({
        variables: {
          token: data.token,
          process: "INCENTIVE_TRACK",
          id: item_id.id,
          approved_by: context.email
        }
      })
    } else {
      setDisableButton(true)
      rejectIncentive({
        variables: {
          id: item_id.id,
          comment: form.comment,
          approved_by: context.email,
          approved_at: moment().format('YYYY-MM-DDThh:mm')
        }
      })
    }
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Form layout='vertical' onFinish={onSubmit}>
        <Form.Item label='Amount' name='amount' initialValue={item_id.amount} >
          <Input placeholder='Approved amount' type='number' min={1} disabled={true} />
        </Form.Item>
        <Form.Item label='Incentive Type' name='type' initialValue={item_id.incentive_config.type}>
          <Input placeholder='Type' disabled={true} />
        </Form.Item>
        {incentive_access ? (
          <Form.Item className='text-right'>
            <Button type='primary' size='middle' loading={disableButton} htmlType='submit'>{title === 'Approve' ? 'Approve' : 'Reject'}</Button>
          </Form.Item>) : null}
      </Form>
      {(loading || mutationLoading) && title === 'Approve' &&
        <Loading fixed />}
    </Modal>
  )
}

export default IncentiveApprove
