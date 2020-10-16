import { Modal, Button, Row, Col, Form, Input, message, Divider } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { useState, useContext } from 'react'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

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

const CustomerPriceEdit = (props) => {
  const { visible, onHide, trip_id, trip_price, loaded, trip_status_id, edit_access } = props

  const [form] = Form.useForm()
  const context = useContext(userContext)
  const customer_advance_percentage = trip_price.customer_advance_percentage
  const partner_advance_percentage = trip_price.partner_advance_percentage
  const [disableButton, setDisableButton] = useState(false)

  const initial = {
    cus_advance: trip_price.bank || ((trip_price.customer_price - trip_price.mamul) * customer_advance_percentage / 100),
    part_advance: ((trip_price.partner_price) * partner_advance_percentage / 100)
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
    if (form.customer_price > u.trip_price_limit || form.customer_price <= 0) {
      message.error('Enter valid customer price')
    } else if (parseInt(form.mamul) < trip_price.system_mamul) {
      message.error(`Mamul Should be greater then ₹${trip_price.system_mamul}`)
    } else {
      setDisableButton(true)
      update_trip_price({
        variables: {
          trip_id: trip_id,
          customer_price: parseFloat(form.customer_price),
          mamul: parseFloat(form.mamul),
          bank: parseFloat(form.bank),
          cash: parseFloat(form.cash),
          to_pay: parseFloat(form.to_pay),
          partner_price: parseFloat(form.partner_price),
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
  }

  const onPerTonPriceChange = (e) => {
    const { value } = e.target
    const ton = form.getFieldValue('ton')
    const cus_price = value * (ton || 1)
    const part_price = cus_price - form.getFieldValue('mamul')
    const cus_adv = (cus_price - form.getFieldValue('mamul')) * customer_advance_percentage / 100
    const part_adv = (cus_price - form.getFieldValue('mamul')) * partner_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const fr8_total = cus_price - (parseFloat(form.getFieldValue('p_total')))
    const fr8_part_total = cus_price - (parseFloat(form.getFieldValue('p_total'))) - form.getFieldValue('mamul')
    const wallet = part_adv - (parseFloat(form.getFieldValue('p_total')))
    const fr8_part_balance = (fr8_total < 0 ? 0 : fr8_total) - form.getFieldValue('mamul') - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      customer_price: cus_price,
      partner_price: part_price < 0 ? 0 : part_price,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0),
      balance: (fr8_total < 0 ? 0 : fr8_total) - (loaded ? trip_price.bank : (bank > 0 ? bank : 0)),
      fp_total: (fr8_part_total < 0 ? 0 : fr8_part_total),
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
    setPrice({ ...price, cus_advance: cus_adv, part_advance: part_adv })
  }
  const onTonChange = (e) => {
    const { value } = e.target
    const price_per_ton = form.getFieldValue('price_per_ton')
    const cus_price = value * (price_per_ton || 1)
    const part_price = cus_price - form.getFieldValue('mamul')
    const cus_adv = (cus_price - form.getFieldValue('mamul')) * customer_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const part_adv = (cus_price - form.getFieldValue('mamul')) * partner_advance_percentage / 100
    const wallet = part_adv - (parseFloat(form.getFieldValue('p_total')))
    const fr8_total = cus_price - (parseFloat(form.getFieldValue('p_total')))
    const fr8_part_total = cus_price - (parseFloat(form.getFieldValue('p_total'))) - -form.getFieldValue('mamul')
    const fr8_part_balance = (fr8_total < 0 ? 0 : fr8_total) - form.getFieldValue('mamul') - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      customer_price: cus_price,
      partner_price: part_price < 0 ? 0 : part_price,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0),
      balance: (fr8_total < 0 ? 0 : fr8_total) - (loaded ? trip_price.bank : (bank > 0 ? bank : 0)),
      fp_total: fr8_part_total < 0 ? 0 : fr8_part_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
    setPrice({ ...price, cus_advance: cus_adv, part_advance: part_adv })
  }
  const onCustomerPriceChange = (e) => {
    const { value } = e.target
    const netPrice = value - form.getFieldValue('mamul')
    const cus_adv = netPrice * customer_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const part_adv = netPrice * partner_advance_percentage / 100
    const wallet = part_adv - (parseFloat(form.getFieldValue('p_total')))
    const fr8_total = value - (parseFloat(form.getFieldValue('p_total')))
    const fr8_part_total = value - (parseFloat(form.getFieldValue('p_total'))) - form.getFieldValue('mamul')
    const fr8_part_balance = (fr8_total < 0 ? 0 : fr8_total) - form.getFieldValue('mamul') - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      customer_price: value,
      partner_price: netPrice < 0 ? 0 : netPrice,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0),
      balance: (fr8_total < 0 ? 0 : fr8_total) - (loaded ? trip_price.bank : (bank > 0 ? bank : 0)),
      fp_total: fr8_part_total < 0 ? 0 : fr8_part_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
    setPrice({ ...price, cus_advance: cus_adv, part_advance: part_adv })
  }
  const onMamulChange = (e) => {
    const { value } = e.target
    const netPrice = form.getFieldValue('customer_price') - value
    const cus_adv = netPrice * customer_advance_percentage / 100
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const part_adv = netPrice * partner_advance_percentage / 100
    const wallet = part_adv - (parseFloat(form.getFieldValue('p_total')))
    const fr8_total = form.getFieldValue('customer_price') - (parseFloat(form.getFieldValue('p_total')))
    const fr8_part_total = form.getFieldValue('total') - (value ? parseFloat(value) : 0)
    const fr8_part_balance = form.getFieldValue('total') - (value ? parseFloat(value) : 0) - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      partner_price: netPrice < 0 ? 0 : netPrice,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: loaded ? trip_price.bank : (bank > 0 ? bank : 0),
      balance: form.getFieldValue('total') - (loaded ? trip_price.bank : (bank > 0 ? bank : 0)),
      fp_total: fr8_part_total < 0 ? 0 : fr8_part_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
    setPrice({ ...price, cus_advance: cus_adv, part_advance: part_adv })
  }
  const onCashChange = (e) => {
    const { value } = e.target
    form.setFieldsValue({
      to_pay: (parseFloat(form.getFieldValue('p_total')) - (value ? parseFloat(value) : 0))
    })
  }

  const onTotalChange = (e) => {
    const { value } = e.target
    const bank = price.cus_advance - ((value ? parseFloat(value) : 0))
    const wallet = price.part_advance - ((value ? parseFloat(value) : 0))
    const fr8_total = (parseFloat(form.getFieldValue('customer_price')) - (value ? parseFloat(value) : 0))
    const fpart_total = ((parseFloat(form.getFieldValue('customer_price')) - form.getFieldValue('mamul')) - (value ? parseFloat(value) : 0))
    const fr8_balance = (parseFloat(form.getFieldValue('customer_price')) - (value ? parseFloat(value) : 0)) - (bank > 0 ? bank : 0)

    form.setFieldsValue({
      cash: 0,
      to_pay: (value ? parseFloat(value) : 0),
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: bank > 0 ? bank : 0,
      balance: fr8_balance < 0 ? 0 : fr8_balance,
      fp_total: fpart_total < 0 ? 0 : fpart_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fpart_total < 0 ? 0 : fpart_total - (wallet < 0 ? 0 : wallet)
    })
  }
  const fr8_partner_advance = ((trip_price.partner_price * trip_price.partner_advance_percentage) / 100) - (trip_price.cash - trip_price.to_pay)
  const layout = {
    labelCol: { xs: 16 },
    wrapperCol: { xs: 8 }
  }
  const authorised = (trip_status_id < 12 && trip_status_id !== 7 && trip_status_id !== 1) && edit_access

  return (
    <Modal
      visible={visible}
      onCancel={onHide}
      style={{ top: 20 }}
      bodyStyle={{ paddingBottom: 0 }}
      footer={[]}
      className='no-header'
    >
      <Form onFinish={onCustomerPriceSubmit} form={form} {...layout} labelAlign='left' colon={false} className='form-sheet'>
        {trip_price.is_price_per_ton ? (
          <div>
            <Form.Item
              label='Price/Ton'
              name='price_per_ton'
              rules={[{ required: true, message: 'Price Per Ton is required field!' }]}
              initialValue={trip_price.price_per_ton || 0}
            >
              <Input
                placeholder='Price/Ton'
                disabled={!authorised}
                onChange={onPerTonPriceChange}
                size='small'
                type='number'
                min={0}
                maxLength={4}
              />
            </Form.Item>
            <Form.Item
              label='Ton'
              name='ton'
              rules={[{ required: true, message: 'No.of Ton is required field!' }]}
              initialValue={trip_price.ton || 0}
            >
              <Input placeholder='Ton' disabled={!authorised} onChange={onTonChange} size='small' type='number' />
            </Form.Item>
          </div>) : null}
        <Form.Item
          label='Customer Price'
          name='customer_price'
          rules={[{ required: true, message: 'Customer Price is required field!' }]}
          initialValue={trip_price.customer_price}
        >
          <Input placeholder='Customer Price' disabled={trip_price.is_price_per_ton || !authorised} onChange={onCustomerPriceChange} size='small' type='number' />
        </Form.Item>
        <Form.Item
          label='Mamul Charge'
          name='mamul'
          initialValue={trip_price.mamul || 0}
        >
          <Input placeholder='Mamul' disabled={!authorised} onChange={onMamulChange} size='small' type='number' />
        </Form.Item>
        <Form.Item
          label='Partner Price'
          name='partner_price'
          initialValue={trip_price.partner_price || 0}
          className='last'
        >
          <Input placeholder='Partner Price' disabled size='small' type='number' />
        </Form.Item>
        <Divider />
        <Form.Item
          label='Customer To Partner'
          name='p_total'
          initialValue={(parseInt(trip_price.to_pay) + parseInt(trip_price.cash)) || 0}
        >
          <Input placeholder='Total' onChange={onTotalChange} disabled={loaded || !authorised} size='small' type='number' />
        </Form.Item>
        <Form.Item
          label={<span>Advance <span>Cash/Bank/Diesel</span></span>}
          name='cash'
          rules={[{ required: true, message: 'Cash is required field!' }]}
          initialValue={trip_price.cash || 0}
          className='indent'
        >
          <Input placeholder='Cash' onChange={onCashChange} disabled={loaded || !authorised} size='small' type='number' />
        </Form.Item>
        <Form.Item
          label={<span>Balance <span>To-pay</span></span>}
          name='to_pay'
          rules={[{ required: true, message: 'To-Pay is required field!' }]}
          initialValue={trip_price.to_pay || 0}
          className='indent last'
        >
          <Input placeholder='To-pay' disabled size='small' type='number' />
        </Form.Item>
        <Divider />
        <Form.Item
          label='Customer To FR8'
          name='total'
          initialValue={(trip_price.customer_price - (trip_price.cash + trip_price.to_pay)) || 0}
        >
          <Input placeholder='Total' disabled size='small' type='number' />
        </Form.Item>
        <Form.Item
          label={<span>{`Advance ${customer_advance_percentage}%`} <span>Bank</span></span>}
          name='bank'
          rules={[{ required: true, message: 'Bank value is required field!' }]}
          initialValue={trip_price.bank || 0}
          className='indent'
        >
          <Input placeholder='Bank' disabled size='small' type='number' />
        </Form.Item>
        <Form.Item
          label='Balance'
          name='balance'
          initialValue={(trip_price.customer_price - (trip_price.bank + trip_price.cash + trip_price.to_pay)) || 0}
          className='indent last'
        >
          <Input placeholder='Balance' disabled size='small' type='number' />
        </Form.Item>
        <Divider />
        <Form.Item
          label='FR8 To Partner'
          name='fp_total'
          initialValue={(trip_price.partner_price - (trip_price.cash + trip_price.to_pay)) || 0}
        >
          <Input placeholder='Total' disabled size='small' type='number' />
        </Form.Item>
        <Form.Item
          label={<span>{`Advance ${trip_price.partner_advance_percentage}%`} <span>Wallet</span></span>}
          name='wallet'
          rules={[{ required: true, message: 'Bank value is required field!' }]}
          initialValue={fr8_partner_advance || 0}
          className='indent'
        >
          <Input placeholder='Bank' disabled size='small' type='number' />
        </Form.Item>
        <Form.Item
          label={<span>Balance <span>Including Commission</span></span>}
          name='fp_balance'
          initialValue={(trip_price.partner_price - (trip_price.cash + trip_price.to_pay + fr8_partner_advance)) || 0}
          className='indent'
        >
          <Input placeholder='Balance' disabled size='small' type='number' />
        </Form.Item>
        <Divider />
        {authorised ? (
          <div>
            <Form.Item
              name='comment'
              initialValue={trip_price.comment || null}
              rules={[{ required: true, message: 'Comment value is required field!' }]}
              className='vertical'
            >
              <Input.TextArea placeholder='Comment' />
            </Form.Item>
            <Row>
              <Col xs={24} className='text-right mt10'>
                <Button type='primary' loading={disableButton} htmlType='submit'>Update</Button>
              </Col>
            </Row>
          </div>)
          : (
            <Row>
              <Col xs={24} className='text-right'>
                <Button onClick={onHide} key='back'>Close</Button>
              </Col>
            </Row>
          )}
      </Form>
    </Modal>
  )
}

export default CustomerPriceEdit
