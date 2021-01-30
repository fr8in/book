import { useState,useContext } from 'react'
import { Row, Button, Input, message, Col, Modal, Form } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import u from '../../lib/util'

const UPDATE_PARTNER_BLACKLIST_MUTATION = gql`
mutation partner_blacklist($id: Int!, $updated_by: String!,$partner_comment:PartnerCommentInput) {
  partner_blacklist(id: $id, updated_by: $updated_by,partner_comment:$partner_comment) {
   description
   status
  }
}`

const UPDATE_PARTNER_UNBLACKLIST_MUTATION = gql`
mutation partner_unblacklist($id: Int!, $updated_by: String!,$partner_comment:PartnerCommentInput) {
  partner_unblacklist(id: $id, updated_by: $updated_by,partner_comment:$partner_comment) {
    description
    status
  }
}`

const PartnerBlacklist = (props) => {
  const { partnerInfo,onHide,visible } = props
  const [disableButton, setDisableButton] = useState(false)
  const [form] = Form.useForm()
  const { topic } = u
  const partner_status = get(partnerInfo, 'partner_status.name', null)
  const is_blacklisted = (partner_status === 'Blacklisted')

  const context = useContext(userContext)
 

 const [updateBlacklist] = useMutation(
    UPDATE_PARTNER_BLACKLIST_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'partner_blacklist.status', null)
        const description = get(data, 'partner_blacklist.description', null)
        if (status === 'OK') {
          message.success(description || 'Blacklisted!!')
          onHide()
        } else {
          message.error(description || 'Error Occured!!')
        }
      }
    }
  )

  const [updateUnblacklist] = useMutation(
    UPDATE_PARTNER_UNBLACKLIST_MUTATION,
    {
      onError (error) { 
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'partner_unblacklist.status', null)
        const description = get(data, 'partner_unblacklist.description', null)
        if (status === 'OK') {
          message.success(description || 'Unblacklisted!!')
          onHide()
        } else {
          message.error(description || 'Error Occured!!')
        }
      }
    }
  )

  const blacklistChange = (form) => {
    if (is_blacklisted) {
      setDisableButton(true)
      updateUnblacklist({
        variables: {
          id: partnerInfo.id,
          updated_by: context.email,
          partner_comment: {
            description: form.comment,
            topic: topic.partner_unblacklist
          }
        }
      })
    } else {
      setDisableButton(true)
      updateBlacklist({
        variables: {
          id: partnerInfo.id,
          updated_by: context.email,
          partner_comment: {
            description: form.comment,
            topic: topic.partner_blacklist
          }
        }
      })
    }
  }

  return (
    <>
      <Modal
        title='Add Comment'
        visible={visible}
        onCancel={onHide}
        footer={[]}
      >
        <Form onFinish={blacklistChange} form={form}>
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
                <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default PartnerBlacklist
