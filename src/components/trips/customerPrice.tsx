import { Modal, Button, Row, Col, Form, Input, message, Divider } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState, useContext } from 'react'
import userContext from '../../lib/userContaxt'

const UPDATE_TRIP_PRICE = gql`
mutation update_trip_price(
  $trip_id: Int, 
  $updated_by: String!
  $customer_price: Float, 
  $mamul: Float, 
  $bank: Float, 
  $cash: Float, 
  $to_pay: Float, 
  $partner_price: Float, 
  $ton: Float, 
  $price_per_ton: Float,
  $is_price_per_ton: Boolean,
	$comment: String,
  $created_by: String,
  $topic: String) {
  update_trip(
    _set:{
      customer_price: $customer_price, 
      mamul: $mamul, 
      updated_by:$updated_by
      bank: $bank, 
      cash: $cash, 
      to_pay: $to_pay,  
      partner_price: $partner_price, 
      ton: $ton, 
      is_price_per_ton: $is_price_per_ton, 
      price_per_ton: $price_per_ton
    }
    where: { id: {_eq: $trip_id}}) {
    returning {
      id
    }
  }
  insert_trip_comment(objects:{trip_id: $trip_id, description: $comment, topic: $topic, created_by: $created_by}){
    returning{ id trip_id }
  }
}`

const CustomerPrice = (props) => {
  const { visible, onHide, trip_id, trip_price, loaded } = props
console.log('trip_price', trip_price)
  const [form] = Form.useForm()
  const context = useContext(userContext)
  const customer_advance_percentage = trip_price.customer_advance_percentage || 90
  const [disableButton, setDisableButton] = useState(false)

  const initial = {
    partner_price: trip_price.partner_price,
    advance: trip_price.bank || (trip_price.customer_price - trip_price.mamul) * customer_advance_percentage / 100,
    adv_percentage: customer_advance_percentage
  }
  const [price, setPrice] = useState(initial)

  const [update_trip_price] = useMutation(
    UPDATE_TRIP_PRICE,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        onHide()
      }
    }
  )

  const onCustomerPriceSubmit = (form) => {
    const old_total = parseFloat(trip_price.cash) + parseFloat(trip_price.to_pay)
    const new_total = parseFloat(form.cash) + parseFloat(form.to_pay)
    const comment = `${form.comment}, Customer Price: ${trip_price.customer_price}/${form.customer_price}, Partner Total: ${old_total}/${new_total}, Partner Advance: ${trip_price.cash}/${form.cash}, Partner Balance: ${trip_price.to_pay}/${form.to_pay}, FR8 Advance: ${trip_price.bank}/${form.bank}`
    setDisableButton(true)
    update_trip_price({
      variables: {
        trip_id: trip_id,
        customer_price: parseFloat(form.customer_price),
        mamul: parseFloat(form.mamul),
        bank: parseFloat(form.bank),
        cash: parseFloat(form.cash),
        to_pay: parseFloat(form.to_pay),
        partner_price: parseFloat(price.partner_price),
        ton: form.ton ? parseInt(form.ton, 10) : null,
        is_price_per_ton: !!form.ton,
        price_per_ton: form.price_per_ton ? parseFloat(form.price_per_ton) : null,
        comment: comment,
        created_by: context.email,
        updated_by: context.email,
        topic: 'Trip Price Changed'
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
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0)
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
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0)
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
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0)
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
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0)
    })
    setPrice({ ...price, partner_price: netPrice, advance: cus_adv })
  }
  const onCashChange = (e) => {
    const { value } = e.target
    form.setFieldsValue({
      to_pay: (parseFloat(form.getFieldValue('p_total')) - (value ? parseFloat(value) : 0))
    })
  }
  const onTotalChange = (e) => {
    const { value } = e.target
    const bank = price.advance - ((value ? parseFloat(value) : 0))
    form.setFieldsValue({
      bank: bank > 0 ? bank : 0,
      to_pay: (value ? parseFloat(value) : 0),
      f_total: (parseFloat(form.getFieldValue('customer_price')) - (value ? parseFloat(value) : 0)),
      cash: 0,
      balance: (parseFloat(form.getFieldValue('customer_price')) - (value ? parseFloat(value) : 0)) - (bank > 0 ? bank : 0)
    })
  }

  const onBankChange = (e) => {
    const { value } = e.target
    const netPrice = form.getFieldValue('customer_price') - form.getFieldValue('mamul')
    const advance = (netPrice - (parseFloat(form.getFieldValue('f_total')) - (value ? parseFloat(value) : 0)))
    const balance = (parseFloat(form.getFieldValue('f_total')) - (value ? parseFloat(value) : 0))
    const adv_percentage = Math.ceil(((netPrice - balance) * 100) / form.getFieldValue('customer_price'))
    form.setFieldsValue({
      balance: balance
    })
    setPrice({ ...price, advance, adv_percentage })
  }
  const initial_adv = trip_price.bank + trip_price.cash + trip_price.to_pay
  return (
    <Modal
      title='Customer Price Change'
      visible={visible}
      onCancel={onHide}
      style={{ top: 20 }}
      bodyStyle={{ paddingBottom: 0 }}
      footer={[]}
    >
      <Form layout='vertical' onFinish={onCustomerPriceSubmit} form={form}>
        {trip_price.is_price_per_ton &&
          <Row gutter={10}>
            <Col xs={24} sm={12}>
              <Form.Item
                label='Per Ton Price'
                name='price_per_ton'
                rules={[{ required: true, message: 'Per Ton Price is required field!' }]}
                initialValue={trip_price.price_per_ton || 0}
              >
                <Input placeholder='Customer Price' onChange={onPerTonPriceChange} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
            <Form.Item
              label='Customer Price'
              name='customer_price'
              rules={[{ required: true, message: 'Customer Price is required field!' }]}
              initialValue={trip_price.customer_price}
            >
              <Input placeholder='Customer Price' disabled={trip_price.is_price_per_ton} onChange={onCustomerPriceChange} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Mamul Charge'
              name='mamul'
              initialValue={trip_price.mamul || 0}
            >
              <Input placeholder='Mamul' onChange={onMamulChange} />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <h4>Customer Payment to</h4>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Partner'
              name='p_total'
              initialValue={(parseInt(trip_price.to_pay) + parseInt(trip_price.cash)) || 0}
            >
              <Input placeholder='Total' onChange={onTotalChange} disabled={loaded} />
            </Form.Item>
            <Row gutter={10}>
              <Col sm={12}>
                <Form.Item
                  label='Advance'
                  name='cash'
                  rules={[{ required: true, message: 'Cash is required field!' }]}
                  initialValue={trip_price.cash || 0}
                >
                  <Input placeholder='Cash' onChange={onCashChange} disabled={loaded} />
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item
                  label='Balance'
                  name='to_pay'
                  rules={[{ required: true, message: 'To-Pay is required field!' }]}
                  initialValue={trip_price.to_pay || 0}
                >
                  <Input placeholder='To-pay' disabled />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='FR8'
              name='f_total'
              initialValue={(trip_price.customer_price - (trip_price.cash + trip_price.to_pay)) || 0}
            >
              <Input placeholder='Total' disabled />
            </Form.Item>
            <Row gutter={10}>
              <Col sm={12}>
                <Form.Item
                  label='Advance'
                  name='bank'
                  rules={[{ required: true, message: 'Bank value is required field!' }]}
                  initialValue={trip_price.bank || 0}
                >
                  <Input placeholder='Bank' disabled={loaded} onChange={onBankChange} />
                </Form.Item>
              </Col>
              <Col sm={12}>
                <Form.Item
                  label='Balance'
                  name='balance'
                  initialValue={(trip_price.customer_price - (trip_price.bank + trip_price.cash + trip_price.to_pay)) || 0}
                >
                  <Input placeholder='Balance' disabled />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
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
            <h4 className='mb0'>Advance ({price.adv_percentage}%): {loaded ? initial_adv : price.advance}</h4>
          </Col>
          <Col flex='100px' className='text-right'>
            <Button type='primary' loading={disableButton} htmlType='submit'>Update</Button>
          </Col>
        </Row>
      </Form>
    </Modal>

  )
}

export default CustomerPrice
