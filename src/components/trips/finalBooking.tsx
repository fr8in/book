import { useState } from 'react'
import { Modal, Button, Row, Col, Form, Input, message, Collapse, Divider, Radio } from 'antd'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import PaymentTraceability from '../customers/paymentTraceability'
import { gql, useMutation, useQuery } from '@apollo/client'
import useShowHide from '../../hooks/useShowHide'

const { Panel } = Collapse

const TRIP_SAP_RECEIPT = gql`
query customerPaymentData($trip_id: Int!) {
  trip_sap_receipt(trip_id: $trip_id) {
    trip_id
    cardcode
    name
    mode
    amount
    date
    doctype
    comment
  }
  trip_sap_onhold_release(trip_id: $trip_id) {
    trip_id
    cardcode
    onHoldAmount
    TDS
  }
}`

const CUSTOMER_FINAL = gql`
mutation customer_final_payment(
  $trip_id: Int!
  $wallet: Float!
  $docentry: Int!
  $cash: Float!
  $rebate: Float!
  $created_by: String!, 
  $shortage_write_off: Float!
  $pod_delay_missing_write_off: Float!
  $late_delivery_write_off: Float!
  $tds_filed_by_partner: Float!
  $loading_charge_write_off: Float!
  $unloading_charge_write_off: Float!
  $mamul_write_off: Float!
  $price_difference_write_off: Float!
  $source_halting_write_off: Float!
  $destination_halting_write_off: Float!
  $tds_filed_by_fr8: Float!
  $header: String
) {
  customer_final_payment(
    trip_id: $trip_id, 
    wallet: $wallet, 
    docentry: $docentry, 
    cash: $cash, 
    rebate: $rebate, 
    created_by: $created_by, 
    shortage_write_off: $shortage_write_off, 
    pod_delay_missing_write_off: $pod_delay_missing_write_off, 
    late_delivery_write_off: $late_delivery_write_off, 
    tds_filed_by_partner: $tds_filed_by_partner, 
    loading_charge_write_off: $loading_charge_write_off, 
    unloading_charge_write_off: $unloading_charge_write_off,
    mamul_write_off: $mamul_write_off, 
    price_difference_write_off: $price_difference_write_off, 
    source_halting_write_off: $source_halting_write_off, 
    destination_halting_write_off: $destination_halting_write_off,
    tds_filed_by_fr8: $tds_filed_by_fr8, 
    header: $header
  ) {
    status
    description
  }
}`

const FinalBooking = (props) => {
  const { visible, onHide, cardcode, mamul, title, price, pending_data, trip_id } = props

  const [form] = Form.useForm()

  const visibleInitial = { excess: false }
  const { visible: visb, onHide: hide, onShow } = useShowHide(visibleInitial)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(false)
  const [amount, setAmount] = useState(null)
  const [header, setHeader] = useState(null)
  const initial = { total: 0, debit: 0, rebate: 0 }
  const [calc, setCalc] = useState(initial)

  const [customer_final_payment] = useMutation(
    CUSTOMER_FINAL,
    {
      onError (error) {
        message.error(error.toString())
        setDisableButton(false)
      },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'customer_final_payment.status', null)
        const description = get(data, 'customer_final_payment.description', null)
        if (status === 'OK') {
          setDisableButton(false)
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )
  const { loading, error, data } = useQuery(
    TRIP_SAP_RECEIPT,
    {
      variables: { trip_id: parseInt(trip_id, 10) },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('FinalBooking Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const trip_sap_receipt = get(_data, 'trip_sap_receipt', [])
  const trip_sap_onhold_release = get(_data, 'trip_sap_onhold_release', [])
  const on_hold = !isEmpty(trip_sap_onhold_release) ? trip_sap_onhold_release[0].onHoldAmount : 0
  const tds = !isEmpty(trip_sap_onhold_release) ? trip_sap_onhold_release[0].TDS : 0

  const customer_payment = !isEmpty(trip_sap_receipt) ? trip_sap_receipt.filter(d => d.doctype === 'I') : []

  const prevShortage = !isEmpty(customer_payment) && customer_payment.filter(d => d.mode === 'Write off Shortage')
  const prevPod = !isEmpty(customer_payment) && customer_payment.filter(d => d.mode === 'Write off POD Delay/Missing')
  const prevLate = !isEmpty(customer_payment) && customer_payment.filter(d => d.mode === 'Write off Late Delivery')
  const prevTDS = !isEmpty(customer_payment) && customer_payment.filter(d => d.mode === 'TDS')
  const prevLoading = !isEmpty(customer_payment) && customer_payment.filter(d => d.mode === 'Write off Loading Charge')
  const prevUnloading = !isEmpty(customer_payment) && customer_payment.filter(d => d.mode === 'Write off UnLoading Charge')

  const disabled = !isEmpty(prevShortage) || !isEmpty(prevPod) || !isEmpty(prevLate) || !isEmpty(prevTDS) || !isEmpty(prevLoading) || !isEmpty(prevUnloading)

  const floatVal = (value) => value ? parseFloat(value) : 0
  const onBlurCalc = () => {
    const debit = floatVal(form.getFieldValue('sortage')) + floatVal(form.getFieldValue('pod_delay')) + floatVal(form.getFieldValue('late_delivery')) + floatVal(form.getFieldValue('tds')) + floatVal(form.getFieldValue('loading_charge')) + floatVal(form.getFieldValue('unloading_charge'))
    const total = debit + floatVal(form.getFieldValue('cash')) + floatVal(form.getFieldValue('mamul')) + floatVal(form.getFieldValue('price_difference')) + floatVal(form.getFieldValue('loading_halting')) + floatVal(form.getFieldValue('unloading_halting')) + floatVal(form.getFieldValue('tds_fr8'))
    const rebate = floatVal(form.getFieldValue('rebate'))
    setCalc({ ...calc, debit: debit, total: total - rebate, rebate: rebate })
    form.setFieldsValue({
      debit: debit,
      release_amount: on_hold - debit
    })
    setHeader(null)
  }
  const excess = calc.debit - pending_data.balance

  const selectOnchange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRows)
    setDisableButton(!!(selectedRows && selectedRows.length === 0))
    setAmount(null)
  }

  const handleSelect = (e) => setHeader(e.target.value)

  const validateWriteOff = (writeOffValue, excess) => floatVal(writeOffValue) > excess

  const validateAllWriteOffs = (excess) => {
    return floatVal(form.getFieldValue('sortage')) < excess && floatVal(form.getFieldValue('pod_delay')) < excess && floatVal(form.getFieldValue('late_delivery')) < excess &&
            floatVal(form.getFieldValue('loading_charge')) < excess && floatVal(form.getFieldValue('unloading_charge')) < excess
  }

  const onFinalBooking = (form) => {
    if ((floatVal(form.cash) === 0) && amount === 0) {
      message.error('Cash or Wallet amount required!')
    } else if (calc.total > pending_data.balance) {
      message.error('Maximum booking amount is ' + pending_data.balance)
    } else {
      setDisableButton(true)
      customer_final_payment({
        variables: {
          trip_id: parseInt(trip_id),
          wallet: floatVal(amount),
          docentry: selectedRow[0].customer_incoming_id,
          cash: floatVal(form.cash),
          rebate: floatVal(form.rebate),
          created_by: 'karthik.@fr8.in',
          shortage_write_off: floatVal(form.sortage),
          pod_delay_missing_write_off: floatVal(form.pod_delay),
          late_delivery_write_off: floatVal(form.late_delivery),
          tds_filed_by_partner: floatVal(form.tds),
          loading_charge_write_off: floatVal(form.loading_charge),
          unloading_charge_write_off: floatVal(form.unloading_charge),
          mamul_write_off: floatVal(form.mamul),
          price_difference_write_off: floatVal(form.price_difference),
          source_halting_write_off: floatVal(form.loading_halting),
          destination_halting_write_off: floatVal(form.unloading_halting),
          tds_filed_by_fr8: floatVal(form.tds_fr8),
          header: header
        }
      })
    }
  }

  return (
    <>
      <Modal
        title={`${title} Booking`}
        visible={visible}
        onCancel={onHide}
        maskClosable={false}
        bodyStyle={{ paddingBottom: 0 }}
        style={{ top: 20 }}
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
        <Form layout='vertical' onFinish={onFinalBooking} form={form}>
          <Row className='mt10' gutter={10}>
            <Col sm={6}>
              <Form.Item label='Cash' name='cash'>
                <Input placeholder='Cash' onBlur={onBlurCalc} type='number' min='0' />
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label='Rebate' name='rebate'>
                <Input placeholder='Rebate' onBlur={onBlurCalc} type='number' min='0' />
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
                    <Input placeholder='Shortage/Damage' disabled={disabled} onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item label='POD Delay/Lost' name='pod_delay'>
                    <Input placeholder='POD Delay/Lost' disabled={disabled} onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item label='Late Delivery' name='late_delivery'>
                    <Input placeholder='Late Delivery' disabled={disabled} onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item label='TDS Filed By Partner' name='tds' initialValue={tds}>
                    <Input placeholder='TDS' disabled={tds > 0} onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col sm={6}>
                  <Form.Item label='Loading Charge' name='loading_charge'>
                    <Input placeholder='Loading Charge' disabled={disabled} onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item label='Unloading Charge' name='unloading_charge'>
                    <Input placeholder='Unloading Charge' disabled={disabled} onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col sm={6}>
                  <Form.Item label='On-Hold' name='on_hold' initialValue={on_hold}>
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
                    <Input placeholder='Mamul' onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item label='Price Difference' name='price_difference'>
                    <Input placeholder='Price Difference' onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item label='Loading Halting' name='loading_halting'>
                    <Input placeholder='Loading Halting' onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
                <Col sm={6}>
                  <Form.Item label='Unloading Halting' name='unloading_halting'>
                    <Input placeholder='Unloading Halting' onBlur={onBlurCalc} type='number' min='0' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col sm={6}>
                  <Form.Item label='TDS Filed By FR8' name='tds_fr8'>
                    <Input placeholder='TDS Filed By FR8' onBlur={onBlurCalc} type='number' min='0' />
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
              <div>Total: <b>{calc.total + (parseFloat(amount) || 0)}</b>, Rebate: <b>{calc.rebate}</b></div>
              <p>Balance: <b>{pending_data.balance}</b>, (Recievables: <b>{price}</b>, Mamul: <b>{mamul}</b>)</p>
            </Col>
            <Col flex='100px' className='text-right'>
              {excess > 0 && !header ? <Button type='primary' onClick={() => onShow('excess')}>Book Excess Write Off</Button>
                : <Button type='primary' htmlType='submit' loading={disableButton}>Book</Button>}
            </Col>
          </Row>
        </Form>
      </Modal>
      {visb.excess &&
        <Modal
          title='Excess write off'
          visible={visb.excess}
          onCancel={hide}
          footer={[
            <Button type='primary' disabled={!header} onClick={hide} key='OK'>OK</Button>
          ]}
        >
          {validateAllWriteOffs(excess)
            ? <p>Write off Excess amount is ₹{excess}. No single write off type has value more than ₹{excess}.</p>
            : (
              <div>
                <p>Write off Excess amount is ₹{excess}. Choose the Write Off Type for this Excess Amount</p>
                <Radio.Group onChange={handleSelect}>
                  {validateWriteOff(form.getFieldValue('shortage'), excess) &&
                    <Radio value='shortageCharge' className='radio-block'>Shortage/Damage</Radio>}
                  {validateWriteOff(form.getFieldValue('pod_delay'), excess) &&
                    <Radio value='podLateFee' className='radio-block'>POD Lost/Delay</Radio>}
                  {validateWriteOff(form.getFieldValue('late_delivery'), excess) &&
                    <Radio value='lateDelivery' className='radio-block'>Late Delivery</Radio>}
                  {validateWriteOff(form.getFieldValue('loading_charge'), excess) &&
                    <Radio value='loadingCharge' className='radio-block'>Loading Charge</Radio>}
                  {validateWriteOff(form.getFieldValue('unloading_charge'), excess) &&
                    <Radio value='unloadingCharge' className='radio-block'>Unloading Charge</Radio>}
                </Radio.Group>
              </div>)}
        </Modal>}
    </>
  )
}

export default FinalBooking