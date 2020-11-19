import { Form, Input, Divider, Radio, Row } from 'antd'
import Loading from '../common/loading'
import { useState } from 'react'
import get from 'lodash/get'
import u from '../../lib/util'

const ToPayPrice = (props) => {
    const { po_data, form, customer, loading, record } = props

    const default_mamul = get(customer, 'system_mamul', 0)
    const customer_price = get(record, 'customer_price', null)
    const customer_advance_percentage = get(customer, 'customer_advance_percentage.name', 90)
    const partner_advance_percentage = get(po_data, 'partner_advance_percentage.name', 70)
    const price_type = get(record, 'is_price_per_ton', false)
    const partner_price = customer_price - default_mamul
    const bank = customer_price ? (customer_price * customer_advance_percentage / 100) : 0
    const wallet = partner_price ? (partner_price * partner_advance_percentage / 100) : 0
    console.log('customer_price',customer_price)
    const initial = {
        part_adv: wallet,
        rate_type: price_type ? 'Rate/Ton' : 'Rate/Trip',
        customer_advance: bank
    }
    const [price, setPrice] = useState(initial)
    const rate_per_ton = (price.rate_type === 'Rate/Ton')
    const onRadioChange = (e) => {
        setPrice({ ...price, rate_type: e.target.value })
      }
      const onCustomerPriceChange = (e) => {
        const { value } = e.target
        const partner_price = (value ? parseFloat(value) : 0)
       const p_total = (value ? parseFloat(value) : 0)
    
        form.setFieldsValue({
          partner_price: partner_price < 0 ? 0 : partner_price,
          p_total: p_total < 0 ? 0 : p_total
        })
      }


      
    return (
        loading ? <Loading /> : (
            <>
                <Form.Item name='trip_rate_type' wrapperCol={{ sm: 24 }} className='mobile-100percent hide-label'>
                    <Radio.Group size='small' onChange={onRadioChange}>
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
                   // onChange={onPerTonPriceChange}
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
                  //  onChange={onTonChange}
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
                    initialValue={customer_price}
                >
                    <Input
                        placeholder='Customer price'
                        disabled={rate_per_ton}
                        size='small'
                        type='number'
                        min={0}
                        maxLength={6}
                        onChange={onCustomerPriceChange}
                        onInput={u.handleLengthCheck}
                    />
                </Form.Item>
                <Form.Item label='Partner Price' name='partner_price'>
                    <Input
                        placeholder='Partner Price'
                        disabled
                        size='small'
                        onInput={u.handleLengthCheck}
                    />
                </Form.Item>
                <Divider />
                <Form.Item label='Customer To Partner' name='p_total'>
                    <Input
                        placeholder='Total'
                        disabled
                        size='small'
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
                        size='small'
                        type='number'
                        min={0}
                        maxLength={6}
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
            </>
        )
    )
}
export default ToPayPrice
