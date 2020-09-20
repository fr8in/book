import { useState } from 'react'
import { Modal, Button, message, Form, Input } from 'antd'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'

const WALLET_TO_BANK = gql`
mutation partner_bank_transfer_track(
  $partner_id: Int!,
  $amount: Float!,
  $created_by: String!,
){
  partner_bank_transfer_track(
    partner_id: $partner_id,
    amount: $amount, 
    created_by:$created_by
  ){
    status
    description
  }
}`

const WalletToBank = (props) => {
  const { visible, onHide, partner_id, balance } = props
  const [disableButton, setDisableButton] = useState(false)

  const [partner_bank_transfer_track] = useMutation(
    WALLET_TO_BANK,
    {
      onError (error) {
        message.error(error.toString())
        setDisableButton(false)
      },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'partner_bank_transfer_track.status', null)
        const description = get(data, 'partner_bank_transfer_track.description', null)
        if (status === 'OK') {
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  const onSubmit = (form) => {
    setDisableButton(true)
    partner_bank_transfer_track({
      variables: {
        partner_id: partner_id,
        amount: parseFloat(form.amount),
        created_by: 'Karthik@fr8.in'
      }
    })
  }
  return (
    <Modal
      title='Wallet To Bank'
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form onFinish={onSubmit} layout='vertical'>
        <Form.Item label='Amount' name='amount' rules={[{ required: true }]} extra={`Balance: ₹${balance}`}>
          <Input type='number' placeholder='Amount' />
        </Form.Item>
        <Form.Item className='text-right'>
          <Button type='primary' loading={disableButton} htmlType='submit'>Pay to Bank</Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default WalletToBank
