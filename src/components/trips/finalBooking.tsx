import { useState } from 'react'
import { Modal, Button, Row, Col, Form, Input, message, Collapse, Divider } from 'antd'
import get from 'lodash/get'
import PaymentTraceability from '../customers/paymentTraceability'
import { gql, useMutation } from '@apollo/client'

const { Panel } = Collapse

const CUSTOMER_FINAL = gql`
mutation customer_final_payment(
  $cash: Float!, 
  $docentry: Int!, 
  $created_by: String!, 
  $trip_id: Int!, 
  $wallet: Float!
  $destination_write_off: Float!
  $late_delivery_write_off: Float!
  $loading_charge_write_off: Float!
  $mamul_write_off: Float!
  $pod_delay_missing_write_off: Float!
  $price_difference_write_off: Float!
  $rebate: Float!
  $shortage_write_off: Float!
  $tds_filed_by_fr8: Float!
  $tds_filed_by_partner: Float!
  $unloading_charge_write_off: Float!) {
  customer_final_payment(
    cash: $cash, 
    docentry: $docentry, 
    created_by: $created_by, 
    trip_id: $trip_id, 
    wallet: $wallet, 
    destination_write_off: $destination_write_off, 
    late_delivery_write_off: $late_delivery_write_off, 
    loading_charge_write_off: $loading_charge_write_off, 
    mamul_write_off: $mamul_write_off, 
    pod_delay_missing_write_off: $pod_delay_missing_write_off, 
    price_difference_write_off: $price_difference_write_off, 
    rebate: $rebate, 
    shortage_write_off: $shortage_write_off, 
    tds_filed_by_fr8: $tds_filed_by_fr8, 
    tds_filed_by_partner: $tds_filed_by_partner, 
    unloading_charge_write_off: $unloading_charge_write_off) {
    status
    description
  }
}`

const FinalBooking = (props) => {
  const { visible, onHide, cardcode, mamul, title, price, pending_data, trip_id } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(false)
  const [amount, setAmount] = useState(null)

  const [customer_final_payment] = useMutation(
    CUSTOMER_FINAL,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'customer_final_payment.status', null)
        const description = get(data, 'customer_final_payment.description', null)
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

  const onFinalBooking = (form) => {
    console.log('final booking')
  }
  const total = 0 // TODO
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
      <Form layout='vertical' onFinish={onFinalBooking}>
        <Row className='mt10' gutter={10}>
          <Col sm={6}>
            <Form.Item label='Cash' name='cash'>
              <Input placeholder='Cash' />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item label='Rebate' name='excess'>
              <Input placeholder='Rebate' />
            </Form.Item>
          </Col>
        </Row>
        <Collapse accordion className='small box-0' ghost>
          <Panel header='Write Off' key='1'>
            <h4 className='mt10'>Partner</h4>
            <Divider />
            <Row gutter={10}>
              <Col sm={6}>
                <Form.Item label='Shortage/Damage' name='sortage'>
                  <Input placeholder='Shortage/Damage' />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='POD Delay/Lost' name='pod_delay'>
                  <Input placeholder='POD Delay/Lost' />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='Late Delivery' name='late_delivery'>
                  <Input placeholder='Late Delivery' />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='TDS Filed By Partner' name='tds'>
                  <Input placeholder='TDS' disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col sm={6}>
                <Form.Item label='Loading Charge' name='loading_charge'>
                  <Input placeholder='Loading Charge' />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='Unloading Charge' name='unloading_charge'>
                  <Input placeholder='Unloading Charge' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col sm={6}>
                <Form.Item label='On-Hold' name='on_hold'>
                  <Input placeholder='On-Hold' disabled />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='Debit' name='debit'>
                  <Input placeholder='Debit' disabled />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='Release Amount' name='release_amount'>
                  <Input placeholder='Release Amount' disabled />
                </Form.Item>
              </Col>
            </Row>
            <h4>FR8</h4>
            <Divider />
            <Row gutter={10}>
              <Col sm={6}>
                <Form.Item label='Mamul' name='mamul'>
                  <Input placeholder='Mamul' />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='Price Difference' name='price_difference'>
                  <Input placeholder='Price Difference' />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='Loading Halting' name='loading_halting'>
                  <Input placeholder='Loading Halting' />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item label='Unloading Halting' name='unloading_halting'>
                  <Input placeholder='Unloading Halting' disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col sm={6}>
                <Form.Item label='TDS Filed By FR8' name='tds_fr8'>
                  <Input placeholder='TDS Filed By FR8' />
                </Form.Item>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Form.Item label='Comments' name='comment' rules={[{ required: true }]}>
          <Input.TextArea placeholder='comment' />
        </Form.Item>
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

export default FinalBooking
