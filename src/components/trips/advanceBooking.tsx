import { useState } from 'react'
import { Modal, Button, Row, Col, Form, Input, message } from 'antd'
import get from 'lodash/get'
import PaymentTraceability from '../customers/paymentTraceability'
import { gql, useMutation } from '@apollo/client'

const CUSTOMER_ADVANCE = gql`
mutation customer_advance(
  $cash: Float!
  $docentry: Int!
  $created_by: String!
  $trip_id: Int!
  $wallet: Float!
) {
  customer_advance(
    cash: $cash,
    docentry: $docentry,
    created_by: $created_by,
    trip_id: $trip_id,
    wallet: $wallet
  ) {
    status
    description
  }
}`

const AdvanceBooking = (props) => {
  const { visible, onHide, cardcode, mamul, title, price, pending_data, trip_id } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(false)
  const [amount, setAmount] = useState(null)
  const [cash, setCash] = useState(null)

  const [customer_advance_booking] = useMutation(
    CUSTOMER_ADVANCE,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'customer_advance.status', null)
        const description = get(data, 'customer_advance.description', null)
        if (status === 'OK') {
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  const selectOnchange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRows)
    setDisableButton(!!(selectedRows && selectedRows.length === 0))
    setAmount(null)
  }

  const onAdvanceBooking = (form) => {
    setDisableButton(true)
    customer_advance_booking({
      variables: {
        trip_id: parseInt(trip_id, 10),
        wallet: parseFloat(amount),
        cash: parseFloat(form.cash),
        docentry: selectedRow[0].customer_incoming_id,
        created_by: 'karthik@fr8.in'
      }
    })
  }
  const total = (cash ? parseInt(cash) : 0) + (amount ? parseInt(amount) : 0)
  return (
    <Modal
      title={`${title} Booking`}
      visible={visible}
      onCancel={onHide}
      maskClosable={false}
      bodyStyle={{ paddingBottom: 0 }}
      width={850}
      footer={[]}
    >
      <PaymentTraceability
        selectedRowKeys={selectedRowKeys}
        selectOnchange={selectOnchange}
        cardcode={cardcode}
        amount={amount}
        setAmount={setAmount}
      />
      <Form layout='vertical' onFinish={onAdvanceBooking}>
        <Row className='mt10'>
          <Col sm={10}>
            <Form.Item
              label='Cash'
              name='cash'
            >
              <Input
                placeholder='Cash'
                onChange={e => setCash(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col flex='auto'>
            <div>Total: <b>{total}</b></div>
            <p>Advance: <b>{pending_data.pending}</b>, (Recievables: <b>{price}</b>, Mamul: <b>{mamul}</b>)</p>
          </Col>
          <Col flex='100px' className='text-right'>
            <Button type='primary' htmlType='submit' loading={disableButton}>Book</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AdvanceBooking
