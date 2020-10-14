import { useState } from 'react'
import { Modal, Row, Button, Col, message } from 'antd'
import PaymentTraceability from './paymentTraceability'
import { gql, useMutation } from '@apollo/client'
import get from 'lodash/get'

const CUSTOMER_EXCESS_PAYMENT = gql`
mutation customer_excess_payment ($amount:Float!,$customer_id:Int!,$doc_entry:Int!){
  customer_excess_payment( amount: $amount, customer_id:$customer_id , doc_entry:$doc_entry) {
    description
    status
  }
}
`

const Rebate = (props) => {
  const { visible, onHide, cardcode, customer_id, walletcode, wallet_balance } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(true)
  const [amount, setAmount] = useState(null)

  const [excess_payment_booking] = useMutation(
    CUSTOMER_EXCESS_PAYMENT,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
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
    if (amount > 0) {
      setDisableButton(true)
      excess_payment_booking({
        variables: {
          customer_id: customer_id,
          doc_entry: selectedRow[0].docentry,
          amount: parseFloat(amount)
        }
      })
    } else { message.error('Enter the valid amount') }
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
            amount={amount}
            setAmount={setAmount}
            walletcode={walletcode}
            customer_id={customer_id}
            wallet_balance={wallet_balance}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default Rebate
