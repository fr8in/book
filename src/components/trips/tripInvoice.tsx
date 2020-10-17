import { useState, useContext } from 'react'
import { Row, Col, Input, Button, Checkbox, Space, Form, message } from 'antd'
import InvoiceItem from './invoiceItem'
import get from 'lodash/get'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'

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
    customer_balance
    onHold
    customer_halting{
      destination_halting
      source_halting
    }
    partner_halting{
      destination_halting
      source_halting
    }
    advance_percentage
    commission_percentage
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
  $topic: String
  $description: String
  $createdBy: String!
  $onHold: Float!
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
    trip_id: $trip_id,
    topic: $topic,
    description: $description,
    createdBy: $createdBy
    onHold: $onHold
  ){
    success
    message
  }
}`

const TripInvoice = (props) => {
  const { trip_info } = props
  const context = useContext(userContext)
  const [lchecked, setLchecked] = useState(false)
  const [uchecked, setUchecked] = useState(false)

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
        const cus_l_halting = get(data, 'calculate_onHold.customer_halting.source_halting', null)
        const l_halting = get(data, 'calculate_onHold.partner_halting.source_halting', null)
        const cus_un_halting = get(data, 'calculate_onHold.customer_halting.destination_halting', null)
        const un_halting = get(data, 'calculate_onHold.partner_halting.destination_halting', null)

        setCalc({ ...calc, completed: true, balance, commission, on_hold, loading_clac: false })
        form.setFieldsValue({
          onHold: on_hold
        })

        if (form.getFieldValue('loading_days')) {
          form.setFieldsValue({ loading_halting: l_halting })
        } else {
          form.setFieldsValue({ loading_halting: l_halting, customer_loading_halting: cus_l_halting })
        }
        if (form.getFieldValue('unloading_days')) {
          form.setFieldsValue({ unloading_halting: un_halting })
        } else {
          form.setFieldsValue({ unloading_halting: un_halting, customer_unloading_halting: cus_un_halting })
        }
        message.success('Calculated!')
      }
    }
  )

  const [create_invoice] = useMutation(
    CREATE_INVOICE,
    {
      onError (error) {
        message.error(error.toString())
        setCalc({ ...calc, loading_submit: false })
      },
      onCompleted (data) {
        const success = get(data, 'create_invoice.success', null)
        const description = get(data, 'create_invoice.message', null)
        if (success) {
          setCalc({ ...calc, loading_submit: false })
          message.success(description || 'Processed!')
        } else {
          setCalc({ ...calc, loading_submit: false })
          message.error(description)
        }
      }
    }
  )
  const floatVal = (value) => value ? parseFloat(value) : 0
  console.log('checked', lchecked && !(floatVal(form.getFieldValue('customer_loading_halting')) && floatVal(form.getFieldValue('loading_halting'))))
  const onCalcutation = () => {
    if (trip_info.billing_remarks && !form.getFieldValue('remarks')) {
      message.error('Confirm other charges booked for Customer/Partner')
    } else if (lchecked && !(floatVal(form.getFieldValue('customer_loading_halting')) && floatVal(form.getFieldValue('loading_halting')))) {
      message.error('Loading halting Required for both partner and customer')
    } else if (uchecked && !(floatVal(form.getFieldValue('customer_unloading_halting')) && floatVal(form.getFieldValue('unloading_halting')))) {
      message.error('Unloading halting Required for both partner and customer')
    } else if (form.getFieldValue('customer_loading_halting') && (form.getFieldValue('customer_loading_halting') < form.getFieldValue('loading_halting'))) {
      message.error('Partner loading halting should be less than customer loading halting')
    } else if (form.getFieldValue('customer_unloading_halting') && (form.getFieldValue('customer_unloading_halting') < form.getFieldValue('unloading_halting'))) {
      message.error('Partner unloading halting should be less than customer unloading halting')
    } else {
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
  }
  const onInvoiceSubmit = (form) => {
    setCalc({ ...calc, loading_submit: true })
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
        part_other_charge: floatVal(form.other_charge),
        topic: 'Invoiced',
        description: form.comment,
        createdBy: context.email,
        onHold: form.onHold
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
        checked={lchecked}
        setChecked={setLchecked}
        form={form}
        item_label='Loading Halting'
        dayInput
        days_name='loading_days'
        field_name='loading_halting'
        halting_label='Customer Loading Halting'
        spl_name='customer_loading_halting'
        disable={calc.completed}
      />
      <InvoiceItem
        checkbox
        checked={uchecked}
        setChecked={setUchecked}
        item_label='Unloading Halting'
        form={form}
        dayInput
        days_name='unloading_days'
        field_name='unloading_halting'
        halting_label='Customer Unloading Halting'
        spl_name='customer_unloading_halting'
        disable={calc.completed}
      />
      <InvoiceItem
        chargeIncluded
        item_label='Loading Charge'
        field_name='loading_charge'
        fInitialValue={0}
        disable={calc.completed}
      />
      <InvoiceItem
        chargeIncluded={false}
        item_label='Unloading Charge'
        field_name='unloading_charge'
        disable={calc.completed}
      />
      <InvoiceItem
        item_label='Other Charge'
        field_name='other_charge'
        disable={calc.completed}
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
            value={calc.balance ? calc.balance.toFixed(2) : 0}
          />
          <InvoiceItem
            item_label='Commission Fee'
            amount
            value={calc.commission ? calc.commission.toFixed(2) : 0}
          />
          <InvoiceItem
            item_label='On Hold'
            field_name='onHold'
            value={calc.on_hold ? calc.on_hold.toFixed(2) : 0}
          />
          <Form.Item className='item' name='comment' rules={[{ required: true }]}>
            <Input.TextArea
              placeholder='Comment'
            />
          </Form.Item>
        </>}
      {trip_info.billing_remarks &&
        <Form.Item className='item' name='remarks' valuePropName='checked'>
          <Checkbox disabled={calc.completed}>
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
              disabled={calc.completed}
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
