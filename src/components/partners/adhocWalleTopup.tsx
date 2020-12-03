import { useState, useContext } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Modal, Input, Button, Form, Row, Space, Checkbox,message } from 'antd'
import _ from 'lodash'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import Loading from '../common/loading'

const GET_TOKEN = gql`
query get_token ($partner_id: Int!,$cardcode:String!){
  token(ref_id: $partner_id, process:"WALLET_TOP_UP_ADHOC"),
  partner_sap_accounting(cardcode: $cardcode) {
    billed
    cleared
    commission
    wallet
    on_hold
  }
}`

const ADHOC_WALLET_TOPUP = gql`
mutation partner_wallet_topup_adhoc($partner_id: Int!, $amount: Float!, $created_by: String!, $comment: String!, $discountFlag: Boolean!, $token: String!) {
  partner_wallet_topup_adhoc(partner_id: $partner_id, amount: $amount, created_by: $created_by, comment: $comment, discountFlag: $discountFlag, token: $token) {
    description
    status
  }
}`

const AdhocwalletTopup = (props) => {
  const { visible, onHide, partner_id,partner_info } = props
  
   const { loading, data, error } = useQuery(GET_TOKEN, { variables: { partner_id,cardcode:partner_info.cardcode }, fetchPolicy: 'network-only' })

  if (error) {
    message.error(error.toString())
    onHide()
  }
 
  const [selectedTopUps, setSelectedTopUps] = useState(true)
  const [disbleBtn, setDisbleBtn] = useState(false)
  const [netAmount, setNetAmount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const context = useContext(userContext)
  const [form] = Form.useForm()

  const onhold = get(data, 'partner_sap_accounting.on_hold', 0)
  const cleared = get(data, 'partner_sap_accounting.cleared', 0)
  const max_amount = onhold + cleared
  const max_amount_limit = max_amount > 0 ? max_amount : 0

  const handlediscountchange = (e) => {
    const amount= form.getFieldValue('amount') || 0
    setSelectedTopUps(e.target.checked)
    calculateDiscount(amount, e.target.checked)
  }

  const calculateDiscount = (amount, isDiscountSelected) => {
    const discount = isDiscountSelected ? (amount * 2) / 100 : 0
    const netAmount = amount - discount
    setNetAmount(netAmount)
    setDiscount(discount)
  }

  const handleamountvalue = (e) => {
    calculateDiscount(e.target.value, selectedTopUps)
  }
  const [partner_bank_transfer_track, { loading: mutationLoading }] = useMutation(
    ADHOC_WALLET_TOPUP,
    {
      onError (error) {
        message.error(error.toString())
        setDisbleBtn(false)
        onHide()
      },
      onCompleted (data) {
        const status = get(data, 'partner_wallet_topup_adhoc.status', null)
        const description = get(data, 'partner_wallet_topup_adhoc.description', null)
        if (status === 'OK') {
          setDisbleBtn(false)
          message.success(description || 'Processed!')
          onHide()
        } else {
          setDisbleBtn(false)
          message.error(description)
          onHide()
        }
      }
    }
  )

  const onSubmit = (form) => {
    setDisbleBtn(true)
    if(partner_info.partner_status.name === 'Blacklisted'){
      message.error('Partner Blacklisted')
      setDisbleBtn(false)
      
    }else if (partner_info.wallet_block === true){
      message.error('Wallet Block')
      setDisbleBtn(false)
    }else{
    partner_bank_transfer_track({
      variables: {
        token: data.token,
        partner_id,
        amount: parseFloat(form.amount),
        created_by: context.email,
        comment: form.comment,
        discountFlag: !!selectedTopUps
      }
    })
  }
  }

  return (
    <Modal
      title='Adhoc Wallet Top Up'
      visible={visible}
      onCancel={onHide}
      width={500}
      bodyStyle={{ padding: 20 }}
      style={{ top: 20 }}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onSubmit} form={form}>
        <Form.Item label='Amount' name='amount' rules={[{ required: true }]} extra={`Maximum Limit: ₹${max_amount_limit}`}>
          <Input type='number' min={1} placeholder='Amount' onChange={handleamountvalue} />
        </Form.Item>
        <Form.Item label='Comment' name='comment' rules={[{ required: true, message: 'Comment required' }]} >
          <Input type="textarea" placeholder='Enter the Comment' />
        </Form.Item>
        <Form.Item >
          <Space>
            <Checkbox defaultChecked={selectedTopUps} onChange={handlediscountchange} >2% Discount</Checkbox>
            <b> {discount.toFixed(2)} </b>
            &nbsp;
            <b > Amount : {netAmount.toFixed(2)} </b>
          </Space>
          <Row justify='end' className='m5'>
            <Space>
              <Button onClick={onHide}>Cancel</Button>
              <Button type='primary'  htmlType='submit' loading={disbleBtn} >Top Up</Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
      {(loading || mutationLoading) &&
        <Loading fixed />}
    </Modal>
  )
}

export default AdhocwalletTopup
