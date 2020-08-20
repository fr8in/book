import { useState } from 'react'
import { Modal, Row, Button, Form, Col, Select, Card, Divider } from 'antd'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import PoDetail from './poDetail'

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
    $partner_price: Float,
    $ton: float8,
    $per_ton:float8,
    $is_per_ton:Boolean, 
    $mamul: Float,
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
        partner_price: $partner_price,
        ton: $ton,
        price_per_ton:$per_ton,
        is_price_per_ton: $is_per_ton,
        mamul: $mamul,
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
  const { visible, onHide, po_data } = props

  const [form] = Form.useForm()

  const initial = { search: '', customer_id: null, source_id: null, destination_id: null }
  const [obj, setObj] = useState(initial)

  const { loading, error, data } = useQuery(
    CUSTOMER_SEARCH,
    {
      variables: { search: obj.search || '' }
    }
  )

  console.log('CreateExcessLoad Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const customerSearch = _data.search_customer

  const onSubmit = (form) => {
    console.log('Customer PO is Created!', form)
  }

  const onSourceChange = (city_id) => {
    console.log('source', city_id)
  }

  const onDestinationChange = (city_id) => {
    console.log('destination', city_id)
  }

  const onCusSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onCusSelect = (value, customer) => {
    console.log('customer', customer.key)
    setObj({ ...obj, customer_id: customer.key })
  }

  const partner_name = po_data && po_data.partner && po_data.partner.name
  return (
    <Modal
      visible={visible}
      title={`PO: ${partner_name}`}
      onOk={onSubmit}
      onCancel={onHide}
      width={960}
      style={{ top: 20 }}
      footer={[]}
    >
      <Form form={form} layout='vertical' className='create-po' onFinish={onSubmit}>
        <Link href='trucks/[id]' as={`trucks/${1}`}>
          <a className='truckPO'>{po_data.truck_no}</a>
        </Link>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item label='Customer' name='customer' rules={[{ required: true }]}>
              <Select
                placeholder='Customer'
                showSearch
                disabled={false}
                onSearch={onCusSearch}
                onChange={onCusSelect}
              >
                {customerSearch && customerSearch.map(_cus => (
                  <Select.Option key={_cus.id} value={_cus.description}>{_cus.description}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Card size='small' className='po-card'>
          {obj.customer_id &&
            <div>
              <PoDetail
                customer_id={obj.customer_id}
                po_data={po_data && po_data.partner}
                onSourceChange={onSourceChange}
                onDestinationChange={onDestinationChange}
                form={form}
              />
              <Divider className='hidden-xs' />
              <div className='text-right'>
                <Button type='primary' htmlType='submit'>Create</Button>
              </div>
            </div>}
        </Card>
      </Form>
    </Modal>
  )
}

export default CustomerPo
