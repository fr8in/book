import { Modal, Button, Row, Col, Form, Input, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'

const CUSTOMER_MUTATION = gql`
mutation insertTripPrice($trip_id: Int, $customer_price: Float, $mamul: Float, $bank: Float, $cash: Float, $to_pay: Float, $comment: String, $partner_price: Float, $ton: float8, $price_per_ton: float8, $is_ton: Boolean) {
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
    is_price_per_ton: $is_ton, 
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
  const initial = {
    customer_price: trip_price.customer_price,
    mamul: trip_price.mamul
  }
  const [priceCalc, setPriceCalc] = useState(initial)

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
    // insertTripPrice({
    //   variables: {
    //     trip_id: trip_id,
    //     customer_price: parseInt(form.customer_price, 10),
    //     mamul: parseInt(form.mamul, 10),
    //     bank: parseInt(form.bank, 10),
    //     cash: parseInt(form.cash, 10),
    //     to_pay: parseInt(form.to_pay, 10),
    //     comment: form.comment,
    //     partner_price: parseInt(partner_price, 10),
    //     ton: null,
    //     is_price_per_ton: false,
    //     price_per_ton: null
    //   }
    // })
  }

  const onPerTonPriceChange = (e) => {
    setPriceCalc({ ...priceCalc, customer_price: e.target.value })
  }
  const onTonChange = (e) => {
    setPriceCalc({ ...priceCalc, mamul: e.target.value })
  }
  const onCustomerPriceChange = (e) => {
    setPriceCalc({ ...priceCalc, customer_price: e.target.value })
  }
  const onMamulChange = (e) => {
    setPriceCalc({ ...priceCalc, mamul: e.target.value })
  }

  const advancewithMamul = Math.ceil((priceCalc.customer_price / 100) * trip_price.customer_advance_percentage)
  const advance = advancewithMamul - priceCalc.mamul
  const partner_price = priceCalc.customer_price - priceCalc.mamul

  return (
    <Modal
      title={`Customer Price Change - Advance (${trip_price.customer_advance_percentage}%): ${advance}`}
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
                initialValue={trip_price.price_per_ton}
              >
                <Input placeholder='Customer Price' onChange={onPerTonPriceChange} />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='No.of Ton'
                name='ton'
                initialValue={trip_price.ton}
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
              initialValue={trip_price.mamul}
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
              <Input placeholder='Bank' />
            </Form.Item>
          </Col>
          <Col sm={8}>
            <Form.Item
              label='Cash'
              name='cash'
              rules={[{ required: true, message: 'Cash is required field!' }]}
              initialValue={trip_price.cash || 0}
            >
              <Input placeholder='Cash' />
            </Form.Item>
          </Col>
          <Col sm={8}>
            <Form.Item
              label='To-Pay'
              name='to_pay'
              rules={[{ required: true, message: 'To-Pay is required field!' }]}
              initialValue={trip_price.to_pay || 0}
            >
              <Input placeholder='To-pay' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col sm={24}>
            <Form.Item
              label='Comment'
              name='comment'
              initialValue={trip_price.comment || null}
              rules={[{ required: true, message: 'Comment value is required field!' }]}
            >
              <Input placeholder='Comment' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col flex='auto'>
            <h4>Partner Price: {partner_price}</h4>
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
