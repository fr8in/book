import { useState } from 'react'
import { Row, Col, Input, Button, Checkbox, Space, Form, message } from 'antd'
import InvoiceItem from './invoiceItem'
import get from 'lodash/get'
import { gql, useMutation } from '@apollo/client'

const CALCULATE_ONHOLD = gql`
mutation calculate_onHold(
  $trip_id: Int!
  $destination_halting_days: Float
  $source_halting_days: Float
  $cus_destination_halting: Float
  $cus_loading_charge: Float
  $cus_other_charge: Float
  $cus_source_halting: Float
  $cus_unloading_charge: Float
  $part_destination_halting: Float
  $part_loading_charge: Float
  $part_other_charge: Float
  $part_source_halting: Float
  $part_unloading_charge: Float
) {
  calculate_onHold(
    customer_charge: {
      destination_halting_charge: $cus_destination_halting, 
      loading_charge: $cus_loading_charge, 
      other_charge: $cus_other_charge, 
      source_halting_charge: $cus_source_halting, 
      unloading_charge: $cus_unloading_charge
    }, partner_charge: {
      destination_halting_charge: $part_destination_halting, 
      loading_charge: $part_loading_charge, 
      other_charge: $part_other_charge, 
      source_halting_charge: $part_source_halting, 
      unloading_charge: $part_unloading_charge
    }, 
    destination_halting_days: $destination_halting_days, 
    source_halting_days: $source_halting_days, 
    trip_id: $trip_id
  ) {
    commission
    advance_percentage
    commission_percentage
    customer_balance
    onHold
  }
}`

const CREATE_INVOICE = gql`
mutation create_invoice(
  $trip_id: Int!
  $destination_halting_days: Float
  $source_halting_days: Float
  $cus_destination_halting: Float
  $cus_loading_charge: Float
  $cus_other_charge: Float
  $cus_source_halting: Float
  $cus_unloading_charge: Float
  $part_destination_halting: Float
  $part_loading_charge: Float
  $part_other_charge: Float
  $part_source_halting: Float
  $part_unloading_charge: Float
){
  create_invoice(
     customer_charge: {
      destination_halting_charge: $cus_destination_halting, 
      loading_charge: $cus_loading_charge, 
      other_charge: $cus_other_charge, 
      source_halting_charge: $cus_source_halting, 
      unloading_charge: $cus_unloading_charge
    }, partner_charge: {
      destination_halting_charge: $part_destination_halting, 
      loading_charge: $part_loading_charge, 
      other_charge: $part_other_charge, 
      source_halting_charge: $part_source_halting, 
      unloading_charge: $part_unloading_charge
    }, 
    destination_halting_days: $destination_halting_days, 
    source_halting_days: $source_halting_days, 
    trip_id: $trip_id
  ){
    success
    message
  }
}`

const TripInvoice = (props) => {
  const { trip_info } = props

  const initial = {
    completed: false,
    balance: null,
    commission: null,
    on_hold: null,
    loading_clac: false,
    loading_submit: false
  }
  const [calc, setCalc] = useState(initial)
  const [form] = Form.useForm()

  const [calculate_onHold] = useMutation(
    CALCULATE_ONHOLD,
    {
      onError (error) {
        message.error(error.toString())
        setCalc({ ...calc, loading_clac: false })
      },
      onCompleted (data) {
        const commission = get(data, 'calculate_onHold.commission', null)
        const balance = get(data, 'calculate_onHold.customer_balance', null)
        const on_hold = get(data, 'calculate_onHold.onHold', null)
        setCalc({
          ...calc,
          completed: true,
          balance,
          commission,
          on_hold,
          loading_clac: false
        })
        message.success('calculated!')
      }
    }
  )

  const [create_invoice] = useMutation(
    CREATE_INVOICE,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const success = get(data, 'create_invoice.success', null)
        const description = get(data, 'create_invoice.message', null)
        if (success) {
          message.success(description || 'Processed!')
        } else (message.error(description))
      }
    }
  )

  const floatVal = (value) => value ? parseFloat(value) : 0
  const onCalcutation = () => {
    setCalc({ ...calc, loading_clac: true })
    calculate_onHold({
      variables: {
        trip_id: trip_info.id,
        source_halting_days: floatVal(form.getFieldValue('loading_days')) || null, // must be value or null don't send zero
        destination_halting_days: floatVal(form.getFieldValue('unloading_days')) || null, // must be value or null don't send zero
        cus_source_halting: floatVal(form.getFieldValue('customer_loading_halting')) || floatVal(form.getFieldValue('loading_halting')),
        cus_destination_halting: floatVal(form.getFieldValue('customer_unloading_halting')) || floatVal(form.getFieldValue('unloading_halting')),
        cus_loading_charge: floatVal(form.getFieldValue('loading_charge')),
        cus_unloading_charge: floatVal(form.getFieldValue('unloading_charge')),
        cus_other_charge: floatVal(form.getFieldValue('other_charge')),
        part_source_halting: floatVal(form.getFieldValue('loading_halting')),
        part_destination_halting: floatVal(form.getFieldValue('unloading_halting')),
        part_loading_charge: floatVal(form.getFieldValue('loading_charge')),
        part_unloading_charge: floatVal(form.getFieldValue('unloading_charge')),
        part_other_charge: floatVal(form.getFieldValue('other_charge'))
      }
    })
  }
  const onInvoiceSubmit = (form) => {
    create_invoice({
      variables: {
        trip_id: trip_info.id,
        source_halting_days: floatVal(form.loading_days) || null, // must be value or null don't send zero
        destination_halting_days: floatVal(form.unloading_days) || null, // must be value or null don't send zero
        cus_source_halting: floatVal(form.customer_loading_halting) || floatVal(form.loading_halting),
        cus_destination_halting: floatVal(form.customer_unloading_halting) || floatVal(form.unloading_halting),
        cus_loading_charge: floatVal(form.loading_charge),
        cus_unloading_charge: floatVal(form.unloading_charge),
        cus_other_charge: floatVal(form.other_charge),
        part_source_halting: floatVal(form.loading_halting),
        part_destination_halting: floatVal(form.unloading_halting),
        part_loading_charge: floatVal(form.loading_charge),
        part_unloading_charge: floatVal(form.unloading_charge),
        part_other_charge: floatVal(form.other_charge)
      }
    })
  }
  const onReset = () => {
    form.resetFields()
    setCalc(initial)
  }

  return (
    <Form className='invoice' onFinish={onInvoiceSubmit} form={form}>
      <Row gutter={6} className='item header'>
        <Col flex='auto'><label>Charges</label></Col>
        <Col flex='auto' className='text-right'>Amount</Col>
      </Row>
      <InvoiceItem
        item_label='Partner Price'
        amount
        value={get(trip_info, 'partner_price', 0)}
      />
      <InvoiceItem
        item_label='Mamul Charge'
        amount
        value={get(trip_info, 'mamul', 0)}
      />
      <InvoiceItem
        checkbox
        item_label='Loading Halting'
        dayInput
        days_name='loading_days'
        field_name='loading_halting'
        halting_label='Customer Loading Halting'
        spl_name='customer_loading_halting'
      />
      <InvoiceItem
        checkbox
        item_label='Unloading Halting'
        dayInput
        days_name='unloading_days'
        field_name='unloading_halting'
        halting_label='Customer Unloading Halting'
        spl_name='customer_unloading_halting'
      />
      <InvoiceItem
        chargeIncluded
        item_label='Loading Charge'
        field_name='loading_charge'
        fInitialValue={0}
      />
      <InvoiceItem
        chargeIncluded={false}
        item_label='Unloading Charge'
        field_name='unloading_charge'
      />
      <InvoiceItem
        item_label='Other Charge'
        field_name='other_charge'
      />
      <InvoiceItem
        item_label='LR Incentive'
        amount
        value={get(trip_info, 'lr_incentive', 0)}
      />
      <InvoiceItem
        item_label='POD Incentive'
        amount
        value={get(trip_info, 'pod_incentive', 0)}
      />
      {calc.completed &&
        <>
          <InvoiceItem
            item_label='Customer Balance'
            amount
            value={calc.balance}
          />
          <InvoiceItem
            item_label='Commission Fee'
            amount
            value={calc.commission}
          />
          <InvoiceItem
            item_label='On Hold'
            amount
            value={calc.on_hold}
          />

          <Form.Item className='item' name='comment' rules={[{ required: true }]}>
            <Input.TextArea
              placeholder='Comment'
            />
          </Form.Item>
        </>}
      {trip_info.billing_remarks &&
        <Form.Item className='item' name='remarks' rules={[{ required: true }]}>
          <Checkbox checked={false}>
                Confirm other charges booked for Customer/Partner
          </Checkbox>
        </Form.Item>}
      <Row className='item'>
        <Col flex='120px' className='text-left'>
          <Button onClick={onReset}>Reset</Button>
        </Col>
        <Col flex='auto' className='text-right'>
          <Space>
            <Button
              type='primary'
              ghost
              onClick={onCalcutation}
              loading={calc.loading_clac}
            >
              Calculate On-Hold
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              disabled={!calc.completed}
              loading={calc.loading_submit}
            >
              Submit
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default TripInvoice
