import { Modal, Button, Input, Row, Form, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

const UPDATE_PARTNER_ADDRESS_MUTATION = gql`
mutation update_address($address:jsonb, $cardcode:String){
  update_partner(_set:{address: $address} where: {cardcode:{_eq:$cardcode}}){
    returning{
      id
      address
    }
  }
}
`
const EditAddress = (props) => {
  const { visible, onHide, cardcode } = props

  const [disableButton, setDisableButton] = useState(false)

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
        address: address
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
          <Form.Item name='no'>
            <Input placeholder='Building Number' />
          </Form.Item>
          <Form.Item name='address'>
            <Input placeholder='Address' />
          </Form.Item>
          <Form.Item name='city'>
            <Input placeholder='City' />
          </Form.Item>
          <Form.Item name='state'>
            <Input placeholder='State' />
          </Form.Item>
          <Form.Item name='pin_code'>
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
