import { useState } from 'react'
import { Row, Button, Input, message, Space } from 'antd'
import { gql, useMutation } from '@apollo/client'

const INSERT_PARTNER_REJECT_MUTATION = gql`
mutation partnerKycReject ($description:String, $topic:String, $partner_id: Int, $created_by:String, $partner_status_id:Int,$id:Int! ){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$created_by})
    {
      returning
      {
        id
      }
    }
    update_partner_by_pk(pk_columns:{id:$id} , _set:{partner_status_id:$partner_status_id})
    {
      id
    name
    }
}
`
const KycReject = (props) => {
  const { partner_id } = props
  const { onHide } = props
  const [userComment, setUserComment] = useState('')

  console.log('partner_id', partner_id)
  const [insertComment] = useMutation(
    INSERT_PARTNER_REJECT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        onHide()
      }
    }
  )
  const handleChange = (e) => {
    setUserComment(e.target.value)
  }
  console.log('userComment', userComment)

  const onSubmit = () => {
    insertComment({
      variables: {
        partner_id: partner_id,
        created_by: 'shilpa',
        description: userComment,
        topic: 'Kyc Rejected',
        partner_status_id: 3,
        id: partner_id
      }
    })
  }

  return (
    <>
      <Row>
        <Input
          placeholder='Enter Reject Reason'
          value={userComment}
          onChange={handleChange}
        />
      </Row>
      <br />
      <Row justify='end'>
        <Space>
          <Button size='middle' onClick={onHide}>Cancel</Button>
          <Button type='primary' size='middle' onClick={onSubmit}>Ok</Button>
        </Space>
      </Row>
    </>
  )
}

export default KycReject
