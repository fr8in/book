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

  const initial = {
    part_adv: wallet,
    rate_type: price_type ? 'Rate/Ton' : 'Rate/Trip',
    cus_adv: bank
  }
  const [price, setPrice] = useState(initial)
  const rate_per_ton = (price.rate_type === 'Rate/Ton')

  const modelInitial = { mamulVisible: false }
  const { visible, onHide, onShow } = useShowHide(modelInitial)

  useEffect(() => {
    form.setFieldsValue({ mamul: default_mamul })
  }, [loading])

  const onRadioChange = (e) => {
    setPrice({ ...price, rate_type: e.target.value })
  }

  const onPerTonPriceChange = (e) => {
    const { value } = e.target
    const cus_price = value * (form.getFieldValue('ton') || 1)
    const part_price = cus_price - form.getFieldValue('mamul')
    const cus_adv = cus_price * customer_advance_percentage / 100
    const fr8_total = cus_price - (parseFloat(form.getFieldValue('p_total')))
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const balance = (fr8_total < 0 ? 0 : fr8_total) - (bank > 0 ? bank : 0)
    const fr8_part_total = part_price - (parseFloat(form.getFieldValue('p_total')))
    const wallet = (part_price * partner_advance_percentage / 100) - parseFloat(form.getFieldValue('p_total'))
    const fr8_part_balance = (fr8_part_total < 0 ? 0 : fr8_part_total) - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      customer_price: cus_price,
      partner_price: part_price < 0 ? 0 : part_price,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: (bank > 0 ? bank : 0),
      balance: balance < 0 ? 0 : balance,
      fp_total: (fr8_part_total < 0 ? 0 : fr8_part_total),
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
  }
  const onTonChange = (e) => {
    const { value } = e.target
    const cus_price = value * (form.getFieldValue('price_per_ton') || 1)
    const part_price = cus_price - form.getFieldValue('mamul')
    const cus_adv = cus_price * customer_advance_percentage / 100
    const fr8_total = cus_price - (parseFloat(form.getFieldValue('p_total')))
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const balance = (fr8_total < 0 ? 0 : fr8_total) - (bank > 0 ? bank : 0)
    const fr8_part_total = part_price - (parseFloat(form.getFieldValue('p_total')))
    const wallet = (part_price * partner_advance_percentage / 100) - parseFloat(form.getFieldValue('p_total'))
    const fr8_part_balance = (fr8_part_total < 0 ? 0 : fr8_part_total) - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      customer_price: cus_price,
      partner_price: part_price < 0 ? 0 : part_price,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: (bank > 0 ? bank : 0),
      balance: balance < 0 ? 0 : balance,
      fp_total: fr8_part_total < 0 ? 0 : fr8_part_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
  }
  const onCustomerPriceChange = (e) => {
    const { value } = e.target
    const part_price = (value ? parseFloat(value) : 0) - form.getFieldValue('mamul')
    const cus_adv = (value ? parseFloat(value) : 0) * customer_advance_percentage / 100
    const fr8_total = value - (parseFloat(form.getFieldValue('p_total')))
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const balance = (fr8_total < 0 ? 0 : fr8_total) - (bank > 0 ? bank : 0)
    const fr8_part_total = part_price - (parseFloat(form.getFieldValue('p_total')))
    const wallet = ((part_price * partner_advance_percentage) / 100) - form.getFieldValue('p_total')
    const fr8_part_balance = (fr8_part_total < 0 ? 0 : fr8_part_total) - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      partner_price: part_price < 0 ? 0 : part_price,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: (bank < 0 ? 0 : bank),
      balance: balance < 0 ? 0 : balance,
      fp_total: fr8_part_total < 0 ? 0 : fr8_part_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
  }
  const onMamulChange = (e) => {
    const { value } = e.target
    const part_price = form.getFieldValue('customer_price') - value
    const cus_adv = form.getFieldValue('customer_price') * customer_advance_percentage / 100
    const fr8_total = form.getFieldValue('customer_price') - (parseFloat(form.getFieldValue('p_total')))
    const bank = cus_adv - (parseFloat(form.getFieldValue('p_total')))
    const balance = (fr8_total < 0 ? 0 : fr8_total) - (bank > 0 ? bank : 0)
    const fr8_part_total = form.getFieldValue('total') - (value ? parseFloat(value) : 0)
    const wallet = (part_price * partner_advance_percentage / 100) - (parseFloat(form.getFieldValue('p_total')))
    const fr8_part_balance = (fr8_part_total < 0 ? 0 : fr8_part_total) - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      partner_price: part_price < 0 ? 0 : part_price,
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: (bank > 0 ? bank : 0),
      balance: balance < 0 ? 0 : balance,
      fp_total: fr8_part_total < 0 ? 0 : fr8_part_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: fr8_part_balance < 0 ? 0 : fr8_part_balance
    })
  }
  const onCashChange = (e) => {
    const { value } = e.target
    const to_pay = (parseFloat(form.getFieldValue('p_total')) - (value ? parseFloat(value) : 0))
    form.setFieldsValue({
      to_pay: to_pay < 0 ? 0 : to_pay
    })
  }

  const onTotalChange = (e) => {
    const { value } = e.target
    const cus_adv = ((parseFloat(form.getFieldValue('customer_price')) * partner_advance_percentage) / 100)
    const fr8_total = (parseFloat(form.getFieldValue('customer_price')) - (value ? parseFloat(value) : 0))
    const bank = cus_adv - ((value ? parseFloat(value) : 0))
    const fr8_balance = (fr8_total < 0 ? 0 : fr8_total) - (bank > 0 ? bank : 0)
    const fr8_part_total = ((parseFloat(form.getFieldValue('customer_price')) - form.getFieldValue('mamul')) - (value ? parseFloat(value) : 0))
    const wallet = (((parseFloat(form.getFieldValue('customer_price')) - form.getFieldValue('mamul')) * partner_advance_percentage) / 100) - ((value ? parseFloat(value) : 0))
    const fr8_part_balance = fr8_part_total < 0 ? 0 : fr8_part_total - (wallet < 0 ? 0 : wallet)

    form.setFieldsValue({
      cash: 0,
      to_pay: (value ? parseFloat(value) : 0),
      total: fr8_total < 0 ? 0 : fr8_total,
      bank: bank > 0 ? bank : 0,
      balance: fr8_balance < 0 ? 0 : fr8_balance,
      fp_total: fr8_part_total < 0 ? 0 : fr8_part_total,
      wallet: (wallet < 0 ? 0 : wallet),
      fp_balance: (fr8_part_balance < 0 ? 0 : fr8_part_balance)
    })
  }

  return (
    loading ? <Loading /> : (
      <>
        <Row gutter={20}>
          <Col xs={24} sm={24}>
            <Form.Item name='trip_rate_type' initialValue={price.rate_type} wrapperCol={{ sm: 24 }}>
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
                    onChange={onPerTonPriceChange}
                    size='small'
                    type='number'
                    min={0}
                    maxLength={4}
                    onInput={u.handleLengthCheck}
                  />
                </Form.Item>
                <Form.Item label='Ton' name='ton' initialValue={get(record, 'ton', null)}>
                  <Input
                    placeholder='Ton'
                    disabled={false}
                    onChange={onTonChange}
                    size='small'
                    type='number'
                    min={0}
                    maxLength={2}
                    onInput={u.handleLengthCheck}
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
                size='small'
                type='number'
                min={0}
                maxLength={6}
                onInput={u.handleLengthCheck}
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
                min={0}
                maxLength={5}
                onInput={u.handleLengthCheck}
              />
            </Form.Item>
            <Form.Item label='Partner Price' name='partner_price' initialValue={part_price < 0 ? 0 : part_price}>
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
                onChange={onTotalChange}
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
                onChange={onCashChange}
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
              initialValue={cus_price || 0}
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
              initialValue={part_price < 0 ? 0 : part_price}
            >
              <Input placeholder='Total' disabled size='small' type='number' />
            </Form.Item>
            <Form.Item
              label={<span>{`Advance ${partner_advance_percentage}%`} <span>Wallet</span></span>}
              name='wallet'
              rules={[{ required: true, message: 'Bank value is required field!' }]}
              initialValue={wallet < 0 ? 0 : wallet}
              className='indent'
            >
              <Input placeholder='Bank' disabled size='small' type='number' />
            </Form.Item>
            <Form.Item
              label={<span>Balance <span>Including Commission</span></span>}
              name='fp_balance'
              initialValue={(part_price - wallet) < 0 ? 0 : (part_price - wallet)}
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
