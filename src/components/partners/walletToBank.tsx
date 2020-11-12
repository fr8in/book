import { useState,useContext } from 'react'
import { Modal, Button, message, Form, Input, Spin } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const GET_TOKEN = gql`
query get_token (
  $partner_id: Int!
){
  token(partner_id: $partner_id, process: "BANK_TRANSFER_TRACK")
}`

const WALLET_TO_BANK = gql`
mutation partner_bank_transfer_track(
  $token:String!
  $partner_id: Int!,
  $amount: Float!,
  $created_by: String!,
){
  partner_bank_transfer_track(
    partner_id: $partner_id,
    amount: $amount, 
    created_by:$created_by,
    token:$token
  ){
    status
    description
  }
}`

const WalletToBank = (props) => {
  const { visible, onHide, partner_id, balance } = props
  const {loading,data} = useQuery(GET_TOKEN,{variables:{partner_id} ,fetchPolicy:'network-only'})
  const [partner_bank_transfer_track,{loading:mutationLoading}] = useMutation(
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


  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)
  

  const onSubmit = (form) => {
    setDisableButton(true)
    partner_bank_transfer_track({
      variables: {
        token:data.token,
        partner_id,
        amount: parseFloat(form.amount),
        created_by: context.email
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
