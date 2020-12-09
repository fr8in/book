import { Form, Input, Divider, Radio, Row } from 'antd'
import Loading from '../common/loading'
import { useState } from 'react'
import get from 'lodash/get'
import u from '../../lib/util'

const ToPayPrice = (props) => {
    const { form, loading, record } = props

    const customer_price = get(record, 'customer_price', null)
    const price_type = get(record, 'is_price_per_ton', false)

    const initial = {
        rate_type: price_type ? 'Rate/Ton' : 'Rate/Trip',
    }
    const [price, setPrice] = useState(initial)
    const rate_per_ton = (price.rate_type === 'Rate/Ton')

    const onRadioChange = (e) => {
        setPrice({ ...price, rate_type: e.target.value })
        form.resetFields(['to_pay_cash'])
    }

    const onPerTonPriceChange = (e) => {
        const { value } = e.target
        const customer_price = value * (form.getFieldValue('ton') || 1)
        const partner_price = customer_price
        const customer_partner_total = customer_price
        const to_pay = customer_price - parseFloat(form.getFieldValue('to_pay_cash'))

        form.setFieldsValue({
            customer_price: customer_price < 0 ? 0 : customer_price,
            partner_price_total: partner_price < 0 ? 0 : partner_price,
            customer_to_partner_total: customer_partner_total < 0 ? 0 : customer_partner_total,
            to_pay_balance: to_pay < 0 ? 0 : to_pay
        })
    }

    const onTonChange = (e) => {
        const { value } = e.target
        const customer_price = value * (form.getFieldValue('price_per_ton') || 1)
        const partner_price = customer_price
        const customer_partner_total = customer_price
        const to_pay = customer_price - parseFloat(form.getFieldValue('to_pay_cash'))

        form.setFieldsValue({
            customer_price: customer_price,
            partner_price_total: partner_price < 0 ? 0 : partner_price,
            customer_to_partner_total: customer_partner_total < 0 ? 0 : customer_partner_total,
            to_pay_balance: to_pay < 0 ? 0 : to_pay
        })
    }

    const onCustomerPriceChange = (e) => {
        const { value } = e.target
        const partner_price = (value ? parseFloat(value) : 0)
        const customer_partner_total = (value ? parseFloat(value) : 0)
        const to_pay = (value ? parseFloat(value) - parseFloat(form.getFieldValue('to_pay_cash')) : 0)

        form.setFieldsValue({
            partner_price_total: partner_price < 0 ? 0 : partner_price,
            customer_to_partner_total: customer_partner_total < 0 ? 0 : customer_partner_total,
            to_pay_balance: to_pay < 0 ? 0 : to_pay
        })
    }

    const onCashChange = (e) => {
        const { value } = e.target
        const to_pay = (parseFloat(form.getFieldValue('customer_to_partner_total')) - (value ? parseFloat(value) : 0))
        form.setFieldsValue({
            to_pay_balance: to_pay < 0 ? 0 : to_pay
        })
    }

    return (
        loading ? <Loading /> : (
            <>
                  <Form.Item name='trip_rate_type' initialValue={price.rate_type} wrapperCol={{ sm: 24 }} className='mobile-100percent hide-label'>
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
                    initialValue={customer_price || 0}
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
                <Form.Item
                    label='Partner Price'
                    name='partner_price_total'
                    initialValue={customer_price || 0}
                >
                    <Input
                        placeholder='Partner Price'
                        disabled
                        size='small'
                    />
                </Form.Item>
                <Divider />
                <Form.Item
                    label='Customer To Partner'
                    name='customer_to_partner_total'
                    initialValue={customer_price || 0}
                >
                    <Input
                        placeholder='Total'
                        disabled
                        size='small'
                    />
                </Form.Item>
                <Form.Item
                    label={<span>Advance <span>Cash/Bank/Diesel</span></span>}
                    name='to_pay_cash'
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
                    name='to_pay_balance'
                    className='indent'
                    initialValue={customer_price || 0}
                >
                    <Input
                        placeholder='To-pay'
                        disabled
                        size='small'
                    />
                </Form.Item>
            </>
        )
    )
}
export default ToPayPrice
