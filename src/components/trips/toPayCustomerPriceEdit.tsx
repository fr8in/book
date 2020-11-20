import { Form, Input, Divider, Checkbox, Modal, Row, Col, Button, message } from 'antd'
import u from '../../lib/util'
import { gql, useMutation, useSubscription } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'

const TRIP_MAX_PRICE = gql`
subscription config{
  config(where:{key:{_eq:"trip"}}){
    value
  }
}`

const UPDATE_TRIP_PRICE = gql`
mutation update_trip_price(
    $trip_id: Int, 
    $updated_by: String!
    $customer_price: Float, 
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
        updated_by:$updated_by
        cash: $cash, 
        bank: 0, 
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

const ToPayCustomerPriceEdit = (props) => {

    const { visible, onHide, trip_id, trip_price, loaded, trip_status_id, edit_access, lock } = props
    const { topic } = u
    const [form] = Form.useForm()
    const context = useContext(userContext)
    const [disableButton, setDisableButton] = useState(false)

    const { loading, data, error } = useSubscription(TRIP_MAX_PRICE)
    console.log('ToPayCustomerPriceEdit Error', error)

    const [update_trip_price] = useMutation(
        UPDATE_TRIP_PRICE,
        {
            onError(error) {
                setDisableButton(false)
                message.error(error.toString())
            },
            onCompleted() {
                setDisableButton(false)
                message.success('Updated!!')
                onHide()
            }
        }
    )

    let trip_price_max = {}
    if (!loading) {
        trip_price_max = data
    }
    const trip_max_price = get(trip_price_max, 'config[0].value.trip_max_price', null) // max limit default may change

    const onCustomerPriceSubmit = (form) => {
        const old_total = parseFloat(trip_price.cash) + parseFloat(trip_price.to_pay)
        const new_total = parseFloat(form.cash) + parseFloat(form.to_pay_balance)
        const comment = `${form.comment}, Customer Price: ${trip_price.customer_price}/${form.customer_price}, Partner Total: ${old_total}/${new_total}, Partner Advance: ${trip_price.cash}/${form.cash}, Partner Balance: ${trip_price.to_pay}/${form.to_pay_balance}`
        if (form.customer_price > trip_max_price) {
            message.error(`Trip max price limit ₹${trip_max_price}`)
        } else if (form.customer_price <= 0) {
            message.error('Enter valid trip price')
        } else if (parseInt(form.customer_to_partner_total) < parseInt(form.cash)) {
            message.error('Customer to Partner, Total and cash is miss matching')
        } else if (parseInt(form.customer_to_partner_total) > form.customer_price) {
            message.error('Customer to Partner should be less than or euqal to customer price')
        } else {
            setDisableButton(true)
            update_trip_price({
                variables: {
                    trip_id: trip_id,
                    customer_price: parseFloat(form.customer_price),
                    cash: parseFloat(form.cash),
                    to_pay: parseFloat(form.to_pay_balance),
                    partner_price: parseFloat(form.partner_price_total),
                    ton: form.ton ? parseInt(form.ton, 10) : null,
                    is_price_per_ton: !!form.ton,
                    price_per_ton: form.price_per_ton ? parseFloat(form.price_per_ton) : null,
                    comment: comment,
                    created_by: context.email,
                    updated_by: context.email,
                    topic: topic.trip_price_change
                }
            })
        }
    }


    const onPerTonPriceChange = (e) => {
        const { value } = e.target
        const customer_price = value * (form.getFieldValue('ton') || 1)
        const partner_price = customer_price
        const customer_partner_total = customer_price
        const to_pay = customer_price - parseFloat(form.getFieldValue('cash'))

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
        const to_pay = customer_price - parseFloat(form.getFieldValue('cash'))

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
        const to_pay = (value ? parseFloat(value) - parseFloat(form.getFieldValue('cash')) : 0)

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

            <Form onFinish={onCustomerPriceSubmit} form={form} labelAlign='left' colon={false} {...layout} className='form-sheet'>
            <Checkbox checked={true} disabled /> &nbsp; To Pay
                {trip_price.is_price_per_ton ? (
                    <div>
                        <Form.Item
                            label='Price/Ton'
                            name='price_per_ton'
                            rules={[{ required: true, message: 'Price Per Ton is required field!' }]}
                            initialValue={trip_price.price_per_ton || 0}>
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
                        <Form.Item
                            label='Ton'
                            name='ton'
                            rules={[{ required: true, message: 'No.of Ton is required field!' }]}
                            initialValue={trip_price.ton || 0}
                        >
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
                    </div>) : null}
                <Form.Item
                   label={'Customer Price'}
                    name='customer_price'
                    rules={[{ required: true }]}
                    initialValue={trip_price.customer_price}
                >
                    <Input
                        placeholder='Customer price'
                        disabled={trip_price.is_price_per_ton || !authorised || loaded}
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
                    initialValue={trip_price.customer_price}
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
                    initialValue={trip_price.customer_price}
                >
                    <Input
                        placeholder='Total'
                        disabled
                        size='small'
                    />
                </Form.Item>
                <Form.Item
                    label={<span>Advance <span>Cash/Bank/Diesel</span></span>}
                    name='cash'
                    rules={[{ required: true }]}
                    initialValue={trip_price.cash}
                    className='indent'
                >
                    <Input
                        placeholder='Cash'
                        onChange={onCashChange}
                        size='small'
                        type='number'
                        min={0}
                        maxLength={6}
                        disabled={loaded || !authorised}
                        onInput={u.handleLengthCheck}
                    />
                </Form.Item>
                <Form.Item
                    label={<span>Balance <span>To-pay</span></span>}
                    name='to_pay_balance'
                    className='indent'
                    initialValue={trip_price.customer_price - trip_price.cash }
                >
                    <Input
                        placeholder='To-pay'
                        disabled
                        size='small'
                    />
                </Form.Item>
                {authorised && !lock && !loaded ? (
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
export default ToPayCustomerPriceEdit
