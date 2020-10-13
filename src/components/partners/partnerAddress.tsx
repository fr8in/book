import { Modal, Button, Input, Row, Form, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const UPDATE_PARTNER_ADDRESS_MUTATION = gql`
mutation update_address($address:jsonb, $cardcode:String,$updated_by: String!){
  update_partner(_set:{address: $address,updated_by:$updated_by} where: {cardcode:{_eq:$cardcode}}){
    returning{
      id
      address
    }
  }
}
`
const EditAddress = (props) => {
  const { visible, onHide, cardcode ,partnerAddress} = props

  console.log('address',partnerAddress)

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
    console.log('inside form submit', form)
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
        updated_by: context.email
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
          <Form.Item name='no' initialValue={partnerAddress && partnerAddress.no || null}>
            <Input placeholder='Building Number' />
          </Form.Item>
          <Form.Item name='address'  initialValue={partnerAddress && partnerAddress.address || null}>
            <Input placeholder='Address' />
          </Form.Item>
          <Form.Item name='city'  initialValue={partnerAddress && partnerAddress.city || null}>
            <Input placeholder='City' />
          </Form.Item>
          <Form.Item name='state'  initialValue={partnerAddress && partnerAddress.state || null}>
            <Input placeholder='State' />
          </Form.Item>
          <Form.Item name='pin_code'  initialValue={partnerAddress && partnerAddress.pin_code || null}>
            <Input placeholder='Pin Code' />
          </Form.Item>
          <Row justify='end'>
            <Button type='primary' loading={disableButton} htmlType='submit'> Save </Button>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default EditAddress
