import { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Radio, Divider } from 'antd'
import Loading from '../common/loading'
import SystemMamul from '../customers/systemMamul'
import useShowHide from '../../hooks/useShowHide'
import get from 'lodash/get'
import u from '../../lib/util'

const PoPrice = (props) => {
  const { po_data, form, customer, loading, record } = props

  const default_mamul = get(customer, 'system_mamul', 0)
  const cus_price = get(record, 'customer_price', null)
  const customer_advance_percentage = get(customer, 'customer_advance_percentage.name', 90)
  const partner_advance_percentage = get(po_data, 'partner_advance_percentage.name', 70)
  const price_type = get(record, 'is_price_per_ton', false)
  const part_price = cus_price - default_mamul
  const bank = cus_price ? (cus_price * customer_advance_percentage / 100) : 0
  const wallet = part_price ? (part_price * partner_advance_percentage / 100) : 0
  console.log('PO record', record)
  console.log('PO data', po_data)
  const initial = {
    part_adv: wallet,
    rate_type: price_type ? 'Rate/Ton' : 'Rate/Trip',
    cus_adv: bank
  }
  const [trip_price, setTrip_price] = useState(initial)
  const rate_per_ton = (trip_price.rate_type === 'Rate/Ton')
  console.log('trip_price', trip_price)

  const modelInitial = { mamulVisible: false }
  const { visible, onHide, onShow } = useShowHide(modelInitial)

  useEffect(() => {
    form.setFieldsValue({ mamul: default_mamul })
  }, [loading])

  const onRadioChange = (e) => {
    setTrip_price({ ...trip_price, rate_type: e.target.value })
  }

  const onCustomerPriceChange = (e) => {
    const { value } = e.target
    const netPrice = value - form.getFieldValue('mamul')
    const cus_adv = value * customer_advance_percentage / 100
    const part_adv = value * partner_advance_percentage / 100

    form.setFieldsValue({
      customer_price: value,
      partner_price: netPrice,
      bank: Math.floor(cus_adv),
      cash: 0,
      to_pay: 0
    })
    setTrip_price({
      ...trip_price,
      part_price: netPrice,
      part_adv: Math.floor(part_adv),
      part_wallet: part_adv,
      cus_adv: Math.floor(cus_adv),
      part_cash: 0,
      part_to_pay: 0
    })
  }

  const onRatePerTon = (e) => {
    const { value } = e.target
    const ton = form.getFieldValue('ton')
    const cus_adv = Math.floor((value * (ton || 1)) * customer_advance_percentage / 100)
    const part_adv = Math.floor((value * (ton || 1)) * partner_advance_percentage / 100)

    form.setFieldsValue({
      customer_price: value * (ton || 1),
      partner_price: (value * (ton || 1)) - form.getFieldValue('mamul'),
      bank: cus_adv
    })

    setTrip_price({
      ...trip_price,
      part_price: (value * (ton || 1)) - form.getFieldValue('mamul'),
      part_adv: part_adv,
      part_wallet: part_adv,
      cus_adv: cus_adv
    })
  }

  const onTonChange = (e) => {
    const { value } = e.target
    const price_per_ton = form.getFieldValue('price_per_ton')
    const cus_adv = Math.floor((value * (price_per_ton || 1)) * customer_advance_percentage / 100)
    const part_adv = Math.floor((value * (price_per_ton || 1)) * partner_advance_percentage / 100)

    form.setFieldsValue({
      customer_price: value * (price_per_ton || 1),
      partner_price: (value * (price_per_ton || 1)) - form.getFieldValue('mamul'),
      bank: cus_adv
    })

    setTrip_price({
      ...trip_price,
      part_price: (value * (price_per_ton || 1)) - form.getFieldValue('mamul'),
      part_adv: part_adv,
      part_wallet: part_adv,
      cus_adv: cus_adv
    })
  }

  const onMamulChange = (e) => {
    const { value } = e.target
    form.setFieldsValue({
      partner_price: form.getFieldValue('customer_price') - value
    })
    setTrip_price({
      ...trip_price,
      part_price: form.getFieldValue('customer_price') - value,
      part_adv: Math.floor((form.getFieldValue('customer_price') - value) * partner_advance_percentage / 100),
      part_wallet: Math.floor((form.getFieldValue('customer_price') - value) * partner_advance_percentage / 100),
      cus_adv: Math.floor((form.getFieldValue('customer_price') - value) * customer_advance_percentage / 100)
    })
  }

  const onCashChange = (e) => {
    const { value } = e.target
    const to_pay = form.getFieldValue('to_pay')
    form.setFieldsValue({
      bank: trip_price.cus_adv - ((value ? parseInt(value) : 0) + (parseInt(to_pay, 10) || 0))
    })
    setTrip_price({
      ...trip_price,
      part_wallet: trip_price.part_adv - ((value ? parseInt(value) : 0) + (parseInt(to_pay, 10) || 0)),
      part_cash: value
    })
  }

  return (
    loading ? <Loading /> : (
      <>
        <Row gutter={20}>
          <Col xs={24} sm={24}>
            <Form.Item name='trip_rate_type' initialValue={trip_price.rate_type} wrapperCol={{ sm: 24 }}>
              <Radio.Group onChange={onRadioChange} size='small'>
                <Radio value='Rate/Trip'>Rate/Trip</Radio>
                <Radio value='Rate/Ton'>Rate/Ton</Radio>
              </Radio.Group>
            </Form.Item>
            {rate_per_ton && (
              <div>
                <Form.Item label='Price/Ton' name='price_per_ton' initialValue={get(record, 'price_per_ton', null)}>
                  <Input
                    placeholder='Price'
                    disabled={false}
                    onChange={onRatePerTon}
                    type='number'
                    size='small'
                  />
                </Form.Item>
                <Form.Item label='Ton' name='ton' initialValue={get(record, 'ton', null)}>
                  <Input
                    placeholder='Ton'
                    disabled={false}
                    onChange={onTonChange}
                    type='number'
                    size='small'
                  />
                </Form.Item>
              </div>)}
            <Form.Item
              label='Customer Price'
              name='customer_price'
              rules={[{ required: true }]}
              initialValue={cus_price}
            >
              <Input
                placeholder='Customer price'
                disabled={rate_per_ton}
                onChange={onCustomerPriceChange}
                type='number'
                size='small'
              />
            </Form.Item>
            <Form.Item
              name='mamul'
              label={(
                <span>Mamul Charge
                  <span className='link' onClick={default_mamul ? () => onShow('mamulVisible') : () => {}}>S.Mamul: <b>{default_mamul || 0}</b></span>
                </span>
              )}
              rules={[{ required: true }]}
              initialValue={get(record, 'mamul', null)}
            >
              <Input
                placeholder='mamul'
                disabled={false}
                onChange={onMamulChange}
                type='number'
                size='small'
              />
            </Form.Item>
            <Form.Item label='Partner Price' name='partner_price' initialValue={part_price || 0}>
              <Input
                placeholder='Partner Price'
                disabled
                size='small'
              />
            </Form.Item>
            <Divider />
            <Form.Item
              label='Customer To Partner'
              name='p_total'
              initialValue={0}
              rules={[{ required: true }]}
            >
              <Input
                placeholder='Total'
                // onChange={onTotalChange}
                size='small'
                type='number'
                min={0}
                maxLength={6}
                onInput={u.handleLengthCheck}
              />
            </Form.Item>
            <Form.Item
              label={<span>Advance <span>Cash/Bank/Diesel</span></span>}
              name='cash'
              rules={[{ required: true }]}
              initialValue={0}
              className='indent'
            >
              <Input
                placeholder='Cash'
                // onChange={onCashChange}
                size='small'
                type='number'
                min={0}
                maxLength={6}
                onInput={u.handleLengthCheck}
              />
            </Form.Item>
            <Form.Item
              label={<span>Balance <span>To-pay</span></span>}
              name='to_pay'
              initialValue={0}
              className='indent last'
            >
              <Input placeholder='To-pay' disabled size='small' type='number' />
            </Form.Item>
            <Divider />
            <Form.Item
              label='Customer To FR8'
              name='total'
              initialValue={cus_price}
            >
              <Input placeholder='Total' disabled size='small' type='number' />
            </Form.Item>
            <Form.Item
              label={<span>{`Advance ${customer_advance_percentage}%`} <span>Bank</span></span>}
              name='bank'
              rules={[{ required: true, message: 'Bank value is required field!' }]}
              initialValue={bank}
              className='indent'
            >
              <Input placeholder='Bank' disabled size='small' type='number' />
            </Form.Item>
            <Form.Item
              label='Balance'
              name='balance'
              initialValue={cus_price - bank}
              className='indent last'
            >
              <Input placeholder='Balance' disabled size='small' type='number' />
            </Form.Item>
            <Divider />
            <Form.Item
              label='FR8 To Partner'
              name='fp_total'
              initialValue={part_price}
            >
              <Input placeholder='Total' disabled size='small' type='number' />
            </Form.Item>
            <Form.Item
              label={<span>{`Advance ${partner_advance_percentage}%`} <span>Wallet</span></span>}
              name='wallet'
              rules={[{ required: true, message: 'Bank value is required field!' }]}
              initialValue={wallet}
              className='indent'
            >
              <Input placeholder='Bank' disabled size='small' type='number' />
            </Form.Item>
            <Form.Item
              label={<span>Balance <span>Including Commission</span></span>}
              name='fp_balance'
              initialValue={part_price - wallet}
              className='indent'
            >
              <Input placeholder='Balance' disabled size='small' type='number' />
            </Form.Item>
          </Col>
        </Row>
        {visible.mamulVisible && (
          <SystemMamul visible={visible.mamulVisible} onHide={onHide} cardcode={customer.cardcode} />
        )}
      </>)
  )
}

export default PoPrice
