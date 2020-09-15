import { Modal, Button, Row, Col, Form, Input, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

const CUSTOMER_MUTATION = gql`
mutation insert_trip_price($trip_id: Int, $customer_price: Float, $mamul: Float, $bank: Float, $cash: Float, $to_pay: Float, $comment: String, $partner_price: Float, $ton: float8, $price_per_ton: float8, $is_price_per_ton: Boolean) {
  insert_trip_price(objects: {
    trip_id: $trip_id, 
    customer_price: $customer_price, 
    mamul: $mamul, 
    bank: $bank, 
    cash: $cash, 
    to_pay: $to_pay, 
    comment: $comment, 
    partner_price: $partner_price, 
    ton: $ton, 
    is_price_per_ton: $is_price_per_ton, 
    price_per_ton: $price_per_ton
  }) {
    returning {
      id
    }
  }
}
`

const CustomerPrice = (props) => {
  const { visible, onHide, trip_id, trip_price } = props

  const [form] = Form.useForm()

  const customer_advance_percentage = trip_price.customer_advance_percentage || 90
  const customer_advance = (trip_price.customer_price - trip_price.mamul) * customer_advance_percentage / 100

  const initial = { partner_price: trip_price.partner_price, advance: customer_advance }
  const [price, setPrice] = useState(initial)

  const [insertTripPrice] = useMutation(
    CUSTOMER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const onCustomerPriceSubmit = (form) => {
    console.log('inside form submit', form)
    insertTripPrice({
      variables: {
        trip_id: trip_id,
        customer_price: parseFloat(form.customer_price),
        mamul: parseFloat(form.mamul),
        bank: parseFloat(form.bank),
        cash: parseFloat(form.cash),
        to_pay: parseFloat(form.to_pay),
        comment: form.comment,
        partner_price: parseFloat(price.partner_price),
        ton: form.ton ? parseInt(form.ton, 10) : null,
        is_price_per_ton: !!form.ton,
        price_per_ton: form.price_per_ton ? parseFloat(form.price_per_ton) : null
      }
    })
  }

  const onPerTonPriceChange = (e) => {
    const { value } = e.target
    const ton = form.getFieldValue('ton')
    const cus_price = value * (ton || 1)
    const cus_adv = (cus_price - form.getFieldValue('mamul')) * customer_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('cash')) + parseFloat(form.getFieldValue('to_pay')))

    form.setFieldsValue({
      customer_price: cus_price,
      bank: bank > 0 ? bank : 0
    })
    setPrice({ ...price, partner_price: cus_price - form.getFieldValue('mamul'), advance: cus_adv })
  }
  const onTonChange = (e) => {
    const { value } = e.target
    const price_per_ton = form.getFieldValue('price_per_ton')
    const cus_price = value * (price_per_ton || 1)
    const cus_adv = (cus_price - form.getFieldValue('mamul')) * customer_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('cash')) + parseFloat(form.getFieldValue('to_pay')))

    form.setFieldsValue({
      customer_price: cus_price,
      bank: bank > 0 ? bank : 0
    })
    setPrice({ ...price, partner_price: cus_price - form.getFieldValue('mamul'), advance: cus_adv })
  }
  const onCustomerPriceChange = (e) => {
    const { value } = e.target
    const netPrice = value - form.getFieldValue('mamul')
    const cus_adv = netPrice * customer_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('cash')) + parseFloat(form.getFieldValue('to_pay')))

    form.setFieldsValue({
      customer_price: value,
      bank: bank > 0 ? bank : 0
    })
    setPrice({ ...price, partner_price: netPrice, advance: cus_adv })
  }
  const onMamulChange = (e) => {
    const { value } = e.target
    const netPrice = form.getFieldValue('customer_price') - value
    const cus_adv = netPrice * customer_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('cash')) + parseFloat(form.getFieldValue('to_pay')))
    console.log('bank', bank, cus_adv)
    form.setFieldsValue({
      bank: bank > 0 ? bank : 0
    })
    setPrice({ ...price, partner_price: netPrice, advance: parseFloat(cus_adv) })
  }
  const onCashChange = (e) => {
    const { value } = e.target
    const bank = parseFloat(price.advance) - (parseFloat(value) + parseFloat(form.getFieldValue('to_pay')))
    form.setFieldsValue({
      bank: bank > 0 ? bank : 0
    })
  }
  const onToPayChange = (e) => {
    const { value } = e.target
    const bank = parseFloat(price.advance) - (parseFloat(value) + parseFloat(form.getFieldValue('cash')))
    console.log('bank', bank)
    form.setFieldsValue({
      bank: bank > 0 ? bank : 0
    })
  }

  return (
    <Modal
      title={`Customer Price Change - Advance (${customer_advance_percentage}%): ${price.advance}`}
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onCustomerPriceSubmit} form={form}>
        {trip_price.is_price_per_ton &&
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='Per Ton Price'
                name='price_per_ton'
                rules={[{ required: true, message: 'Per Ton Price is required field!' }]}
                initialValue={trip_price.price_per_ton || 0}
              >
                <Input placeholder='Customer Price' onChange={onPerTonPriceChange} />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='No.of Ton'
                name='ton'
                rules={[{ required: true, message: 'No.of Ton is required field!' }]}
                initialValue={trip_price.ton || 0}
              >
                <Input placeholder='Ton' onChange={onTonChange} />
              </Form.Item>
            </Col>
          </Row>}
        <Row gutter={10}>
          <Col sm={12}>
            <Form.Item
              label='Customer Price'
              name='customer_price'
              rules={[{ required: true, message: 'Customer Price is required field!' }]}
              initialValue={trip_price.customer_price}
            >
              <Input placeholder='Customer Price' disabled={trip_price.is_price_per_ton} onChange={onCustomerPriceChange} />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item
              label='Mamul Charge'
              name='mamul'
              initialValue={trip_price.mamul || 0}
            >
              <Input placeholder='Mamul' onChange={onMamulChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col sm={8}>
            <Form.Item
              label='Bank'
              name='bank'
              rules={[{ required: true, message: 'Bank value is required field!' }]}
              initialValue={trip_price.bank || 0}
            >
              <Input placeholder='Bank' disabled />
            </Form.Item>
          </Col>
          <Col sm={8}>
            <Form.Item
              label='Cash'
              name='cash'
              rules={[{ required: true, message: 'Cash is required field!' }]}
              initialValue={trip_price.cash || 0}
            >
              <Input placeholder='Cash' onChange={onCashChange} />
            </Form.Item>
          </Col>
          <Col sm={8}>
            <Form.Item
              label='To-Pay'
              name='to_pay'
              rules={[{ required: true, message: 'To-Pay is required field!' }]}
              initialValue={trip_price.to_pay || 0}
            >
              <Input placeholder='To-pay' onChange={onToPayChange} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label='Comment'
          name='comment'
          initialValue={trip_price.comment || null}
          rules={[{ required: true, message: 'Comment value is required field!' }]}
        >
          <Input placeholder='Comment' />
        </Form.Item>
        <Row>
          <Col flex='auto'>
            <h4>Partner Price: {price.partner_price}</h4>
          </Col>
          <Col flex='100px' className='text-right'>
            <Button type='primary' htmlType='submit'>Update</Button>
          </Col>
        </Row>
      </Form>
    </Modal>

  )
}

export default CustomerPrice
