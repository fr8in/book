import { useState, useContext } from 'react'
import { Row, Button, Input, message, Space } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'

const INSERT_PARTNER_REJECT_MUTATION = gql`
mutation partner_kyc_reject ($description:String, $topic:String, $partner_id: Int, $created_by:String, $partner_status_id:Int,$id:Int!,$updated_by: String!){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$created_by})
    {
      returning
      {
        id
      }
    }
    update_partner_by_pk(pk_columns:{id:$id} , _set:{partner_status_id:$partner_status_id,updated_by:$updated_by})
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
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)

  const [insertComment] = useMutation(
    INSERT_PARTNER_REJECT_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }
    }
  )
  const handleChange = (e) => {
    setUserComment(e.target.value)
  }

  const onSubmit = () => {
    setDisableButton(true)
    insertComment({
      variables: {
        partner_id: partner_id,
        created_by: context.email,
        updated_by: context.email,
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
        <Button type='primary' loading={disableButton} onClick={onSubmit}>Ok</Button>
      </Row>
    </>
  )
}

export default KycReject
