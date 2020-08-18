import { Modal, Row, Button, Form, Input, Col, Select, DatePicker, Radio, Alert, Divider, Checkbox } from 'antd'
import { createPO, customer } from '../../../mock/customer/createQuickPo'
import Link from 'next/link'
import { gql } from '@apollo/client'
import CitySelect from '../common/citySelect'

const CUSTOMER_SEARCH = gql`query cus_search($search:String!){
  search_customer(args:{search:$search}){
    id
    description
  }
}`

const CREATE_PO = gql`
mutation create_po (
    $po_date: timestamptz,
    $source_id: Int, 
    $destination_id: Int, 
    $customer_id: Int, 
    $customer_price: Float, 
    $ton: float8,
    $per_ton:float8,
    $is_per_ton:Boolean, 
    $mamaul: Float,
    $including_loading: Boolean,
    $including_unloading: Boolean,
    $bank:Float,
    $cash: Float,
    $to_pay: Float,
    $truck_id:Int,
    $driver: String,
    $description:String,
    $topic:String,
    $created_by: String ) {
  insert_trip(objects: {
    po_date:$po_date
    source_id: $source_id, 
    destination_id: $destination_id, 
    customer_id: $customer_id,
    truck_type_id: $truck_id,
    driver: $driver,
    trip_prices: {
      data: {
        customer_price: $customer_price,
        ton: $ton,
        price_per_ton:$per_ton,
        is_price_per_ton: $is_per_ton,
        mamul: $mamaul,
        including_loading: $including_loading,
        including_unloading: $including_unloading,
        bank: $bank,
        to_pay:$to_pay,
        cash:$cash
      }
    }
    trip_comments:{
      data:{
        description:$description,
        topic:$topic,
        created_by:$created_by
      }
    }
  }) {
    returning {
      id
    }
  }
}`

const CustomerPo = (props) => {
  const { visible, onHide, data } = props
  console.log('data', data)

  const onSubmit = () => {
    console.log('Customer PO is Created!')
    onHide()
  }
  const onChange = (date, dateString) => {
    console.log(date, dateString)
  }

  const handlechange = (value) => {
    console.log(`Selected ${value}`)
  }

  const showSystemMamul = () => {
    console.log('sys.mamul!!')
  }

  const onSourceChange = (city_id) => {
    console.log('source', city_id)
  }

  const onDestinationChange = (city_id) => {
    console.log('destination', city_id)
  }

  const partner_name = data && data.partner && data.partner.name
  return (
    <Modal
      visible={visible}
      title={`PO: ${partner_name}`}
      onOk={onSubmit}
      onCancel={onHide}
      width={960}
      style={{ top: 20 }}
      footer={[
        <Button key='back' onClick={onHide}>Cancel</Button>,
        <Button key='OK' type='primary' onClick={onSubmit}>Create</Button>
      ]}
    >
      <Form layout='vertical' className='create-po'>
        <Link href='trucks/[id]' as={`trucks/${1}`}>
          <a className='truckPO'>{data.truck_no}</a>
        </Link>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item label='Customer'>
              <Select
                placeholder='Customer'
                onChange={handlechange}
                options={customer}
              />
              {props.error
                ? <Alert message={props.error} type='error' style={{ width: '100%' }} />
                : props.errorMessage &&
                  <Alert message={props.errorMessage} type='error' style={{ width: '100%' }} />}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={12} sm={6}>
            <Form.Item label='PO Date'>
              <DatePicker onChange={onChange} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item label='Loading Point Contact'>
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
            <Form.Item>
              <Radio.Group defaultValue='Rate/Trip' onChange={handlechange}>
                <Radio value='Rate/Trip'>Rate/Trip</Radio>
                <Radio value='Rate/Ton'>Rate/Ton</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Row gutter={10}>
              <Col xs={12}>
                <Form.Item>
                  <Input
                    placeholder='Price'
                    disabled={false}
                    addonBefore='₹'
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item>
                  <Input
                    placeholder='Ton'
                    disabled={false}
                    addonAfter='Ton'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={11} sm={5}>
            <Form.Item label='Customer Price' extra={`Advance% ${90}`}>
              <Input
                placeholder='customerPrice'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={1}>
            <Form.Item label='-' className='hideLabel text-center'>
              <span>-</span>
            </Form.Item>
          </Col>
          <Col xs={12} sm={5}>
            <Form.Item label='Mamul Charge' extra={<span>System Mamul: <span className='link' onClick={showSystemMamul}>400</span></span>}>
              <Input
                placeholder='0'
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
            <Form.Item label='Net Price'>
              <Input
                placeholder='Net Price'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label='Including'>
              <Checkbox>Loading</Checkbox>
              <Checkbox>Unloading</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Divider className='hidden-xs' />
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Row gutter={10}>
              <Col xs={12}>
                <Form.Item label='Bank'>
                  <Input
                    placeholder='Bank'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='Cash'>
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
                <Form.Item label='To-Pay'>
                  <Input
                    placeholder='To-Pay'
                    disabled={false}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item label='Driver Number'>
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
          <Col xs={8} sm={5}>Partner₹: {30000}</Col>
          <Col xs={8} sm={5}>Adv-70%: {21000}</Col>
          <Col xs={8} sm={5}>Wallet: {21000}</Col>
          <Col xs={8} sm={5}>Cash: {0}</Col>
          <Col xs={8} sm={4}>To-Pay: {0}</Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CustomerPo
