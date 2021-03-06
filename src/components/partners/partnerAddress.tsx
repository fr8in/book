import { Modal, Button, Input, Row, Form, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import get from 'lodash/get'
import u from '../../lib/util'

const UPDATE_PARTNER_ADDRESS_MUTATION = gql`
mutation update_address($description:String, $topic:String, $partner_id: Int,$updated_by: String!,$address:jsonb,$cardcode:String){
  insert_partner_comment(objects:{partner_id:$partner_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
   update_partner(_set:{address: $address,updated_by:$updated_by} where: {cardcode:{_eq:$cardcode}}){
    returning{
      id
      address
    }
  }
}`

const EditAddress = (props) => {
  const { visible, onHide, cardcode, partnerAddress ,partner_id } = props
  const { topic } = u

  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const [updatePartnerAddress] = useMutation(
    UPDATE_PARTNER_ADDRESS_MUTATION,
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

  const onAddressSubmit = (form) => {
    setDisableButton(true)
    const address = {
      no: form.no,
      address: form.address,
      city: form.city,
      state: form.state,
      pin_code: form.pin_code
    }
    updatePartnerAddress({
      variables: {
        cardcode: cardcode,
        address: address,
        updated_by: context.email,
        description:`${topic.address} updated by ${context.email}`,
        topic:topic.address,
        partner_id: partner_id
      }
    })
  }

  return (
    <>
      <Modal
        title='Edit Address'
        visible={visible}
        onCancel={onHide}
        footer={null}
      >
        <Form layout='vertical' onFinish={onAddressSubmit}>
          <Form.Item name='no' initialValue={get(partnerAddress, 'no', null)} rules={[{ required: true }]}>
            <Input placeholder='Building Number' />
          </Form.Item>
          <Form.Item name='address' initialValue={get(partnerAddress, 'address', null)} rules={[{ required: true }]}>
            <Input placeholder='Address' />
          </Form.Item>
          <Form.Item name='city' initialValue={get(partnerAddress, 'city', null)} rules={[{ required: true }]}>
            <Input placeholder='City' />
          </Form.Item>
          <Form.Item name='state' initialValue={get(partnerAddress, 'state', null)} rules={[{ required: true }]}>
            <Input placeholder='State' />
          </Form.Item>
          <Form.Item name='pin_code' initialValue={get(partnerAddress, 'pin_code', null)} rules={[{ required: true }]}>
            <Input placeholder='Pin Code' />
          </Form.Item>
          <Row justify='end'>
            <Button type='primary' loading={disableButton} htmlType='submit'>Save</Button>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default EditAddress
