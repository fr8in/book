import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import { Modal, Row, Button, Form, Col, Select, Card, Divider, message } from 'antd'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'
import PoDetail from './poDetail'
import get from 'lodash/get'
import LinkComp from '../common/link'
import PoPrice from './poPrice'

const PO_QUERY = gql`
query po_query($id: Int!, $cus_id: Int!){
  truck(where:{id: {_eq: $id}}) {
    id
    truck_no
    truck_type{
      id
      name
    }
    partner{
      id
      name
      partner_advance_percentage{
        id
        name
      }
    }
  }
  customer(where:{id:{_eq:$cus_id}}){
    id
    cardcode
    name
    exception_date
    managed
    customer_advance_percentage{
      id
      name
    }
    status{
      id
      name
    }
    system_mamul
    customer_users{
      id
      name
      mobile
    }
  }
  config(where:{key:{_eq:"trip"}}){
    value
  }
}`

const CONFIRM_PO = gql`
mutation confirm_po(
  $trip_id: Int!
  $updated_by: String!
  $truck_id: Int!
  $partner_id: Int
  $po_date: timestamp
  $loading_point_id: Int
  $source_id: Int!, 
  $destination_id: Int!, 
  $customer_id: Int,
  $truck_type_id: Int,
  $driver_id: Int
  $customer_price: Float,
  $partner_price: Float,
  $ton: Float,
  $per_ton:Float,
  $is_per_ton:Boolean, 
  $mamul: Float,
  $including_loading: Boolean,
  $including_unloading: Boolean,
  $bank:Float,
  $cash: Float,
  $to_pay: Float,
  ){
  update_trip(_set:{
    truck_id: $truck_id,
    partner_id: $partner_id,
    po_date: $po_date,
    updated_by:$updated_by,
    loading_point_contact_id: $loading_point_id,
    customer_office_id: $loading_point_id,
    source_id: $source_id,
    destination_id: $destination_id,
    customer_id: $customer_id,
    truck_type_id: $truck_type_id,
    driver_id: $driver_id,
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
  }, 
  where:{id:{_eq:$trip_id}}){
    returning{
      id
    }
  }
}`

const ConfirmPo = (props) => {
  const { visible, onHide, truck_id, record, hideExess } = props
  console.log('trip.id', record)
  const [driver_id, setDriver_id] = useState(null)

  const [form] = Form.useForm()
  const initial = { search: '', source_id: null, destination_id: null }
  const [obj, setObj] = useState(initial)
  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const { loading, error, data } = useQuery(
    PO_QUERY,
    {
      variables: { id: truck_id, cus_id: get(record, 'customer.id', null) },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [confirm_po_mutation] = useMutation(
    CONFIRM_PO,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        const load_id = get(data, 'update_trip.returning[0].id', null)
        const msg = (
          <span>
            <span>Load&nbsp;</span>
            <LinkComp type='trips' data={load_id} id={load_id} />
            <span>&nbsp;Confimed!</span>
          </span>
        )
        setDisableButton(false)
        message.success(msg)
        setObj(initial)
        onHide()
        hideExess()
      }
    }
  )

  console.log('CreateExcessLoad Error', error)
  if (loading) return null

  const po_data = get(data, 'truck[0]', null)
  const customer = get(data, 'customer[0]', null)
  const trip_max_price = get(data, 'config[0].value.trip_max_price', null)
  const system_mamul = get(customer, 'system_mamul', null)

  const onSubmit = (form) => {
    const loading_charge = form.charge_inclue.includes('Loading')
    const unloading_charge = form.charge_inclue.includes('Unloading')
    if (form.customer_price > trip_max_price) {
      message.error(`Trip max price limit ₹${trip_max_price}`)
    } else if (form.customer_price <= 0) {
      message.error('Enter valid trip price')
    } else if (parseInt(form.p_total) < parseInt(form.cash)) {
      message.error('Customer to Partner, Total and cash is miss matching')
    } else if (parseInt(form.p_total) > form.customer_price) {
      message.error('Customer to Partner should be less than or euqal to customer price')
    } else if (system_mamul > parseFloat(form.mamul)) {
      message.error('Mamul Should be greater than system mamul!')
    } else {
      setDisableButton(true)
      confirm_po_mutation({
        variables: {
          trip_id: record.id,
          po_date: form.po_date.format('YYYY-MM-DD'),
          source_id: obj.source_id ? parseInt(obj.source_id, 10) : get(record, 'source.id', null),
          destination_id: obj.destination_id ? parseInt(obj.destination_id, 10) : get(record, 'destination.id', null),
          customer_id: customer.id,
          partner_id: po_data && po_data.partner && po_data.partner.id,
          customer_price: parseFloat(form.customer_price),
          partner_price: parseFloat(form.partner_price),
          ton: form.ton ? form.ton : null,
          per_ton: form.per_ton_rate ? parseFloat(form.per_ton_rate) : null,
          is_per_ton: !!form.ton,
          mamul: parseFloat(form.mamul),
          including_loading: loading_charge,
          including_unloading: unloading_charge,
          bank: parseFloat(form.bank),
          cash: parseFloat(form.cash),
          to_pay: parseFloat(form.to_pay),
          truck_id: po_data && po_data.id,
          truck_type_id: po_data && po_data.truck_type && po_data.truck_type.id,
          driver_id: parseInt(driver_id, 10),
          updated_by: context.email,
          loading_point_id: form.loading_contact
        }
      })
    }
  }

  const onSourceChange = (city_id) => {
    setObj({ ...obj, source_id: city_id })
  }

  const onDestinationChange = (city_id) => {
    setObj({ ...obj, destination_id: city_id })
  }

  const partner_name = get(po_data, 'partner.name', null)
  const trip_id = get(record, 'id', null)
  const layout = {
    labelCol: { xs: 12 },
    wrapperCol: { xs: 12 }
  }
  return (
    <Modal
      visible={visible}
      onOk={onSubmit}
      onCancel={onHide}
      width={960}
      style={{ top: 20 }}
      bodyStyle={{ paddingBottom: 0 }}
      footer={[]}
      className='no-header'
    >
      <Form form={form} className='create-po form-sheet' labelAlign='left' colon={false} {...layout} onFinish={onSubmit}>
        <Row gutter={20}>
          <Col xs={24} sm={14}>
            <Row>
              <Col sm={12}><h4>{`PO: ${partner_name}`}</h4></Col>
              <Col sm={12} className='text-right'>
                <Link href='trucks/[id]' as={`trucks/${po_data.truck_no}`}>
                  <a>{po_data.truck_no}</a>
                </Link>
                {trip_id &&
                  <span> |&nbsp;
                    <Link href='trips/[id]' as={`trips/${trip_id}`}>
                      <a>{'#' + trip_id}</a>
                    </Link>
                  </span>}
              </Col>
            </Row>
            <Form.Item label='Customer' name='customer' initialValue={customer.name} labelCol={{ sm: 6 }} wrapperCol={{ sm: 18 }}>
              <Select
                placeholder='Customer'
                disabled
                size='small'
              >
                <Select.Option value={customer.id}>{customer.name}</Select.Option>
              </Select>
            </Form.Item>
            {(customer && customer.id) &&
              <PoDetail
                driver_id={setDriver_id}
                po_data={po_data && po_data.partner}
                onSourceChange={onSourceChange}
                onDestinationChange={onDestinationChange}
                form={form}
                customer={customer}
                record={record}
              />}
          </Col>
          <Col xs={24} sm={10}>
            {(customer && customer.id) &&
              <PoPrice
                po_data={po_data && po_data.partner}
                form={form}
                customer={customer}
                record={record}
              />}
          </Col>
        </Row>
        {(customer && customer.id) &&
          <Row justify='end'>
            <Divider />
            <Button className='mt10' type='primary' htmlType='submit'>Create</Button>
          </Row>}
      </Form>
    </Modal>
  )
}

export default ConfirmPo
