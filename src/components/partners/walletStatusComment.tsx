import { useState,useContext } from 'react'
import { Row, Button, Input, message, Col, Modal, Form } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const UPDATE_PARTNER_WALLET_BLOCK_STATUS_MUTATION = gql`
mutation partner_wallet_block ($id:Int!,$updated_by:String!,$partner_comment:PartnerCommentInput){
    partner_wallet_block(id:$id,updated_by:$updated_by,partner_comment:$partner_comment){
      description
      status
    }
  }
`
const UPDATE_PARTNER_WALLET_UNBLOCK_STATUS_MUTATION = gql`
mutation ($id:Int!,$updated_by:String!,$partner_comment:PartnerCommentInput){
    partner_wallet_unblock(id:$id,updated_by:$updated_by,partner_comment:$partner_comment){
      description
      status
    }
  }`
const PartnerWallet = (props) => {
  const { partner_id,onHide,visible,status } = props
  const [disableButton, setDisableButton] = useState(false)
  const [form] = Form.useForm()
  const { topic } = u
  
  const context = useContext(userContext)
 

const [updateStatusId] = useMutation(
    UPDATE_PARTNER_WALLET_BLOCK_STATUS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!')
      onHide() }
    }
  )

  const [updateStatus] = useMutation(
    UPDATE_PARTNER_WALLET_UNBLOCK_STATUS_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
      onHide() }
    }
  )

   const onblock = (form) => {
    setDisableButton(true)
    updateStatusId({
      variables: {
        id: partner_id,
        updated_by: context.email,
        partner_comment: {
        description: form.comment,
        topic: topic.partner_wallet_block
      }
    }
    })
  }

  const onunblock = (form) => {
    setDisableButton(true)
    updateStatus({
      variables: {
        id: partner_id,
        updated_by: context.email,
        partner_comment: {
          description: form.comment,
          topic: topic.partner_wallet_unblock
        }
      }
    })
  }

  const blacklisted = (status || status === null) // wallet_block null also blacklisted
   const onSubmit = blacklisted ? onunblock : onblock

  return (
    <>
      <Modal
        title='Add Comment'
        visible={visible}
        onCancel={onHide}
        footer={[]}
      >
        <Form onFinish={onSubmit} form={form}>
          <Row gutter={10} className='mb10'>
            <Col flex='auto'>
              <Form.Item name='comment'>
                <Input
                  placeholder='Please Enter Comments......'
                />
              </Form.Item>
            </Col>
            <Col flex='80px'>
              <Form.Item>
                <Button type='primary' key='submit' loading={disableButton}  htmlType='submit'>Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default PartnerWallet
