import { useState, useEffect } from 'react'
import { Row, Col, Form, DatePicker, Input, Checkbox, Radio, Divider, Select } from 'antd'
import CitySelect from '../common/citySelect'
import Loading from '../common/loading'
import Driver from '../partners/driver'
import SystemMamul from '../customers/systemMamul'
import useShowHide from '../../hooks/useShowHide'
import get from 'lodash/get'

const PoDetail = (props) => {
  const { po_data, onSourceChange, onDestinationChange, form, driver_id, customer, loading } = props

  const initial = {
    part_price: 0,
    part_adv: 0,
    part_wallet: 0,
    part_cash: 0,
    part_to_pay: 0,
    rate_type: 'Rate/Trip',
    cus_adv: 0
  }
  const [trip_price, setTrip_price] = useState(initial)

  const modelInitial = { mamulVisible: false }
  const { visible, onHide, onShow } = useShowHide(modelInitial)

  const customer_user = get(customer, 'customer_users', [])
  const default_mamul = get(customer, 'system_mamul', null)

  const customer_user_list = customer_user.map((data) => {
    return { value: data.id, label: `${data.name.slice(0, 10)} - ${data.mobile}` }
  })

  const rate_per_ton = (trip_price.rate_type === 'Rate/Ton')
  const customer_advance_percentage = customer && customer.customer_advance_percentage && customer.customer_advance_percentage.name
  const partner_advance_percentage = po_data && po_data.partner_advance_percentage && po_data.partner_advance_percentage.name

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
      cus_adv: Math.floor(cus_adv)
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
    const per_ton_rate = form.getFieldValue('per_ton_rate')
    const cus_adv = Math.floor((value * (per_ton_rate || 1)) * customer_advance_percentage / 100)
    const part_adv = Math.floor((value * (per_ton_rate || 1)) * partner_advance_percentage / 100)

    form.setFieldsValue({
      customer_price: value * (per_ton_rate || 1),
      partner_price: (value * (per_ton_rate || 1)) - form.getFieldValue('mamul'),
      bank: cus_adv
    })

    setTrip_price({
      ...trip_price,
      part_price: (value * (per_ton_rate || 1)) - form.getFieldValue('mamul'),
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
    const to_pay = parseInt(form.getFieldValue('to_pay'), 10)
    form.setFieldsValue({
      bank: trip_price.cus_adv - ((value ? parseInt(value) : 0) + (to_pay || 0))
    })
    setTrip_price({
      ...trip_price,
      part_wallet: trip_price.part_adv - ((value ? parseInt(value) : 0) + (to_pay || 0)),
      part_cash: value
    })
  }

  const onToPayChange = (e) => {
    const { value } = e.target
    const cash = parseInt(form.getFieldValue('cash'))
    form.setFieldsValue({
      bank: trip_price.cus_adv - ((value ? parseInt(value) : 0) + (cash || 0))
    })
    setTrip_price({
      ...trip_price,
      part_wallet: trip_price.part_adv - ((value ? parseInt(value) : 0) + (cash || 0)),
      part_to_pay: value
    })
  }

  return (
    loading ? <Loading /> : (
      <>
        <Row gutter={10}>
          <Col xs={12} sm={6}>
            <Form.Item label='PO Date' name='po_date' rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item label='Loading Point Contact' name='loading_contact' rules={[{ required: true }]}>
              <Select
                placeholder='Customer Type ....'
                options={customer_user_list}
                optionFilterProp='label'
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <CitySelect
              label='Source'
              onChange={onSourceChange}
              required
              name='source'
            />
          </Col>
          <Col xs={24} sm={6}>
            <CitySelect
              label='Destination'
              onChange={onDestinationChange}
              required
              name='destination'
            />
          </Col>
        </Row>
        <Divider className='hidden-xs' />
        <Row gutter={10}>
          <Col xs={24} sm={6}>
            <Form.Item name='trip_rate_type' initialValue='Rate/Trip'>
              <Radio.Group onChange={onRadioChange}>
                <Radio value='Rate/Trip'>Rate/Trip</Radio>
                <Radio value='Rate/Ton'>Rate/Ton</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {rate_per_ton && (
            <Col xs={24} sm={12}>
              <Row gutter={10}>
                <Col xs={12}>
                  <Form.Item name='per_ton_rate'>
                    <Input
                      placeholder='Price'
                      disabled={false}
                      addonBefore='₹'
                      onChange={onRatePerTon}
                      type='number'
                    />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item name='ton'>
                    <Input
                      placeholder='Ton'
                      disabled={false}
                      addonAfter='Ton'
                      onChange={onTonChange}
                      type='number'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>)}
        </Row>
        <Row gutter={10}>
          <Col xs={11} sm={5}>
            <Form.Item
              label='Customer Price'
              extra={`Advance ${customer_advance_percentage}%`}
              name='customer_price'
              rules={[{ required: true }]}
            >
              <Input
                placeholder='Customer price'
                disabled={rate_per_ton}
                onChange={onCustomerPriceChange}
                type='number'
              />
            </Form.Item>
          </Col>
          <Col xs={1}>
            <Form.Item label='-' className='hideLabel text-center'>
              <span>-</span>
            </Form.Item>
          </Col>
          <Col xs={12} sm={5}>
            <Form.Item
              name='mamul'
              label='Mamul Charge'
              rules={[{ required: true }]}
              extra={
                <span>System Mamul:&nbsp;
                  <span className='link' onClick={default_mamul ? () => onShow('mamulVisible') : () => {}}>{default_mamul || 0}</span>
                </span>
              }
            >
              <Input
                placeholder='mamul'
                disabled={false}
                onChange={onMamulChange}
                type='number'
              />
            </Form.Item>
          </Col>
          <Col xs={1}>
            <Form.Item label='=' className='hideLabel text-center hidden-xs'>
              <span>=</span>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} className='hidden-xs'>
            <Form.Item label='Net Price' name='partner_price'>
              <Input
                placeholder='Net Price'
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label='Including' initialValue='' name='charge_inclue'>
              <Checkbox.Group>
                <Checkbox value='Loading'>Loading</Checkbox>
                <Checkbox value='Unloading'>Unloading</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
        <Divider className='hidden-xs' />
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Row gutter={10}>
              <Col xs={12}>
                <Form.Item label='Bank' name='bank'>
                  <Input
                    placeholder='Bank'
                    disabled={false}
                    type='number'
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='Cash' name='cash'>
                  <Input
                    placeholder='Cash'
                    disabled={false}
                    onChange={onCashChange}
                    type='number'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={12}>
            <Row gutter={10}>
              <Col xs={12}>
                <Form.Item label='To-Pay' name='to_pay'>
                  <Input
                    placeholder='To-Pay'
                    disabled={false}
                    onChange={onToPayChange}
                    type='number'
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Driver partner_id={po_data.id} driver_id={driver_id} required />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={8} sm={5}>Partner₹: {trip_price.part_price}</Col>
          <Col xs={8} sm={5}>Adv {partner_advance_percentage}%: {trip_price.part_adv}</Col>
          <Col xs={8} sm={5}>Wallet: {trip_price.part_wallet}</Col>
          <Col xs={8} sm={5}>Cash: {trip_price.part_cash}</Col>
          <Col xs={8} sm={4}>To-Pay: {trip_price.part_to_pay}</Col>
        </Row>
        {visible.mamulVisible && (
          <SystemMamul visible={visible.mamulVisible} onHide={onHide} cardcode={customer.cardcode} />
        )}
      </>)
  )
}

export default PoDetail
