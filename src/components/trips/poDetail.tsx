import { useState, useEffect } from 'react'
import { Row, Col, Form, DatePicker, Input, Checkbox, Radio, Divider } from 'antd'
import CitySelect from '../common/citySelect'
import Loading from '../common/loading'
import { gql, useQuery } from '@apollo/client'

const CUSTOMER_PO_DATA = gql`
query customers_po($id:Int!){
  customer(where:{id:{_eq:$id}}){
    id
    name
    exception_date
    managed
    advancePercentage{
      id
      name
    }
    status{
      id
      name
    }
    customer_mamul_summary{
      system_mamul_avg
    }
    customer_users{
      id
      name
      mobile
    }
  }
}`
const PoDetail = (props) => {
  const { customer_id, po_data, onSourceChange, onDestinationChange, form } = props

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

  const { loading, data, error } = useQuery(
    CUSTOMER_PO_DATA,
    {
      variables: { id: parseInt(customer_id) },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('PODetail Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const customer = _data && _data.customer ? _data.customer[0] : null
  const default_mamul = customer && customer.customer_mamul_summary && customer.customer_mamul_summary.length > 0 ? customer.customer_mamul_summary[0].system_mamul_avg : null

  useEffect(() => {
    setTrip_price({ ...trip_price, mamul: default_mamul })
  }, [loading])

  console.log('customer', customer)

  const rate_per_ton = (trip_price.rate_type === 'Rate/Ton')
  const customer_advance_percentage = customer && customer.advancePercentage && customer.advancePercentage.name
  const partner_advance_percentage = po_data && po_data.partner_advance_percentage && po_data.partner_advance_percentage.name
  console.log('trip_price', trip_price, po_data)

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
      part_adv,
      part_wallet: part_adv,
      cus_adv: Math.floor(cus_adv)
    })
  }

  const onRatePerTon = (e) => {
    const { value } = e.target
    const ton = form.getFieldValue('ton')
    const cus_price = form.getFieldValue('customer_price')
    const cus_adv = Math.floor((value * (ton || 1)) * customer_advance_percentage / 100)
    const part_adv = Math.floor((value * (ton || 1)) * partner_advance_percentage / 100)

    form.setFieldsValue({
      customer_price: value * (ton || 1),
      partner_price: (value * (ton || 1)) - form.getFieldValue('mamul'),
      bank: cus_adv,
      cash: 0,
      to_pay: 0
    })

    setTrip_price({
      ...trip_price,
      part_price: cus_price - form.getFieldValue('mamul'),
      part_adv: part_adv,
      part_wallet: part_adv,
      cus_adv: cus_adv
    })
  }

  const onTonChange = (e) => {
    const { value } = e.target
    const per_ton_rate = form.getFieldValue('per_ton_rate')

    form.setFieldsValue({
      customer_price: value * (per_ton_rate || 1),
      partner_price: (value * (per_ton_rate || 1)) - form.getFieldValue('mamul'),
      bank: Math.floor((value * (per_ton_rate || 1)) * customer_advance_percentage / 100),
      cash: 0,
      to_pay: 0
    })

    setTrip_price({
      ...trip_price,
      part_price: (value * (per_ton_rate || 1)) - form.getFieldValue('mamul'),
      part_adv: Math.floor((value * (per_ton_rate || 1)) * partner_advance_percentage / 100),
      part_wallet: Math.floor((value * (per_ton_rate || 1)) * partner_advance_percentage / 100),
      cus_adv: Math.floor((value * (per_ton_rate || 1)) * customer_advance_percentage / 100)
    })
  }

  return (
    loading ? <Loading /> : (
      <>
        <Row gutter={10}>
          <Col xs={12} sm={6}>
            <Form.Item label='PO Date' name='po_date'>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item label='Loading Point Contact' name='loading_contact'>
              <Input
                placeholder='loading Point Contact'
                disabled={false}
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
            >
              <Input
                placeholder='customerPrice'
                disabled={rate_per_ton}
                onChange={onCustomerPriceChange}
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
              initialValue={default_mamul}
              extra={<span>System Mamul: <span className='link'>{trip_price.mamul || 0}</span></span>}
            >
              <Input
                placeholder='mamul'
                disabled={false}
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
                disabled={false}
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
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='Cash' name='cash'>
                  <Input
                    placeholder='Cash'
                    disabled={false}
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
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='Driver Number' name='driver'>
                  <Input
                    placeholder='Driver Number'
                    disabled={false}
                  />
                </Form.Item>
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
      </>)
  )
}

export default PoDetail
