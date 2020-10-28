import { useContext } from 'react'
import { Row, Button, Input, message, Col, Modal, Form } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import u from '../../lib/util'

const UPDATE_PARTNER_DE_ACTIVATE_MUTATION = gql`
mutation partner_de_activate($description:String, $topic:String, $partner_status_id:Int,$cardcode:String!,$updated_by: String!,$partner_id:Int!){
    insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
      {
        returning
        {
          id
        }
      }
    update_partner( _set: {partner_status_id: $partner_status_id, updated_by: $updated_by}, where: {cardcode:{_eq: $cardcode}} 
    ){
      returning{
        cardcode
        partner_status_id
      }
    }
  }
`
const PartnerReject = (props) => {
  const { partnerInfo,onHide,visible } = props
  const [form] = Form.useForm()
  const { topic } = u
  const partner_status = get(partnerInfo, 'partner_status.name', null)

  const context = useContext(userContext)
 

  const [updateDeactivate] = useMutation(
    UPDATE_PARTNER_DE_ACTIVATE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') 
    onHide()}
    }
  )

  const onSubmit = (form) => {
    const is_deactivate = (partner_status === 'De-activate')
    updateDeactivate({
      variables: {
        cardcode: partnerInfo.cardcode,
        partner_status_id:is_deactivate ? 4 : 6,
        updated_by: context.email,
        description: form.comment,
        topic:is_deactivate ? topic.partner_activation : topic.partner_deactivation,
        partner_id: partnerInfo.id
      }
    })
  }

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
                <Button type='primary' htmlType='submit'>Submit</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default PartnerReject
