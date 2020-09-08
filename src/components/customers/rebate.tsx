import { useState } from 'react'
import { Modal, Row, Button, Col, message } from 'antd'
import PaymentTraceability from './paymentTraceability'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'

const CUSTOMER_EXCESS_PAYMENT = gql`
mutation customer_excess_payment($cardcode: String!, $walletcode: String!, $customer_incoming_id: Int!, $amount: Float! ){
  customer_excess_payment(cardcode: $cardcode, walletcode: $walletcode, customer_incoming_id:$customer_incoming_id, amount:$amount){
    description
    status
  }
}`

const Rebate = (props) => {
  const { visible, onHide, cardcode, walletcode, wallet_balance } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(true)
  const [amount, setAmount] = useState(null)

  const [excess_payment_booking] = useMutation(
    CUSTOMER_EXCESS_PAYMENT,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'customer_excess_payment.status', null)
        const description = get(data, 'customer_excess_payment.description', null)
        if (status === 'OK') {
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  const onSubmit = () => {
    if (amount) {
      setDisableButton(true)
      excess_payment_booking({
        variables: {
          cardcode: cardcode,
          walletcode: walletcode,
          customer_incoming_id: selectedRow[0].customer_incoming_id,
          amount: parseFloat(amount)
        }
      })
    } else { message.error('Enter Amount') }
  }

  const selectOnchange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRows)
    setDisableButton(!!(selectedRows && selectedRows.length === 0))
    setAmount(null)
  }

  return (
    <Modal
      title='Excess Booking'
      visible={visible}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 10 }}
      style={{ top: 20 }}
      footer={<Button type='primary' disabled={disableButton} onClick={onSubmit}>Transfer</Button>}
    >
      <Row>
        <Col xs={24}>
          <PaymentTraceability
            selectedRowKeys={selectedRowKeys}
            selectOnchange={selectOnchange}
            cardcode={cardcode}
            wallet_balance={'Wallet Balance: ₹' + wallet_balance}
            amount={amount}
            setAmount={setAmount}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default Rebate
