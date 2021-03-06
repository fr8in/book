import userContext from '../../lib/userContaxt'
import { useState, useContext } from 'react'
import { Modal, Row, Button, Form, Col, Select, Divider, message, Checkbox } from 'antd'
import Link from 'next/link'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'
import PoDetail from './poDetail'
import get from 'lodash/get'
import LinkComp from '../common/link'
import PoPrice from './poPrice'
import ToPayPrice from '../trips/toPayPrice'

const PO_QUERY = gql`
query po_query($id: Int!, $cus_id: Int!){
  truck(where:{id: {_eq: $id}}) {
    id
    truck_no
    truck_type{
      id
      name
      truck_type_group_id
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
    standard_mamul
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

const CITY_DATA = gql`
query($city_id:Int){
  city(where:{id:{_eq:$city_id}}){
    branch{
      id
    }
  }
}
`

const CUSTOMER_BRANCH_EMPLOYEE_DATA = gql`
query($customer_id:Int,$type_id:Int,$branch_id:Int){
  customer_branch_employee(where:{customer_id:{_eq:$customer_id},truck_type_group:{id:{_eq:$type_id}},branch_employee:{branch_id:{_eq:$branch_id}}}){
    customer_id
    branch_employee{
      branch{
        id
      }
      employee{
        name
      }
    }
  }
}
`

const CONFIRM_PO = gql`
mutation confirm_po(
  $trip_id: Int!
  $updated_by: String!
  $truck_id: Int!
  $partner_id: Int
  $po_date: timestamp
  $customer_user_id: Int
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
  $is_topay: Boolean,
  $interest_id:Int,
  $customer_advance_percentage:Int,
  $customer_total_advance:Float
  ){
  update_trip(_set:{
    truck_id: $truck_id,
    partner_id: $partner_id,
    po_date: $po_date,
    updated_by:$updated_by,
    customer_user_id: $customer_user_id,
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
    cash:$cash,
    is_topay: $is_topay,
    interest_id:$interest_id,
    customer_total_advance:$customer_total_advance,
    customer_advance_percentage:$customer_advance_percentage
  }, 
  where:{id:{_eq:$trip_id}}){
    returning{
      id
    }
  }
}`

const ConfirmPo = (props) => {
  const { visible, onHide, truck_id, record, hideExess } = props
  const [loading_contact_id, setLoading_contact_id] = useState(null)
  const [driver_id, setDriver_id] = useState(null)

  const [form] = Form.useForm()
  const initial = { search: '', source_id: null, destination_id: null }
  const [obj, setObj] = useState(initial)
  const [disableButton, setDisableButton] = useState(false)
  const [isToPay, setIsToPay] = useState(false)
  const context = useContext(userContext)
  const [getCityData, { loading: city_loading, error: city_error, data: _city_data }] = useLazyQuery(CITY_DATA,
    {
      onCompleted(data) {
        if (!get(data, 'city[0].branch.id', null)) {
          message.warning("Selected source city doesn't mapped with branch")
        } else {
          getCustomerBranchData({
            variables: {
              customer_id: get(customer, 'id', null),
              type_id: get(po_data, 'truck_type.truck_type_group_id', null),
              branch_id: get(data, 'city[0].branch.id', null)
            }
          })
        }
      }
    }
  )


  const { loading, error, data } = useQuery(
    PO_QUERY,
    {
      variables: { id: truck_id, cus_id: get(record, 'customer.id', null) },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [getCustomerBranchData, { loading: customer_branch_loading, data: customer_branch_data, error: customer_branch_error }] = useLazyQuery(CUSTOMER_BRANCH_EMPLOYEE_DATA)

  const [confirm_po_mutation] = useMutation(
    CONFIRM_PO,
    {
      onError(error) {
        const msg = get(error, 'graphQLErrors[0].extensions.internal.error.message', error.toString())
        message.error(msg)
        setDisableButton(false)
      },
      onCompleted(data) {
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
        if (hideExess) { hideExess() }
      }
    }
  )

  console.log('CreateExcessLoad Error', error)
  if (loading) return null

  const po_data = get(data, 'truck[0]', null)
  const customer = get(data, 'customer[0]', null)
  const trip_max_price = get(data, 'config[0].value.trip_max_price', null)
  const system_mamul = get(customer, 'system_mamul', null)
  const standard_mamul = get(customer, 'standard_mamul', null)
  const origin_name = get(record, 'leads[0].channel_id', record && record.origin && record.origin.name)
  const mamul = Math.max(system_mamul, standard_mamul)

  let customer_data = {}
  if (!customer_branch_loading) {
    customer_data = customer_branch_data
  }


  const customer_branch_employee = get(customer_data, 'customer_branch_employee[0]', [])
  const customer_branch_employee_name = get(customer_branch_employee, 'branch_employee.employee.name', null)

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
    } else if (mamul > parseFloat(form.mamul)) {
      message.error('Mamul Should be greater than system mamul!')
    } else {
      setDisableButton(true)
      const total_advance = parseFloat(form.bank)+parseFloat(form.cash)+parseFloat(form.to_pay)
        confirm_po_mutation({
          variables: {
            trip_id: record.id,
            po_date: form.po_date.format('YYYY-MM-DD'),
            source_id: obj.source_id ? parseInt(obj.source_id, 10) : get(record, 'source.id', null),
            destination_id: obj.destination_id ? parseInt(obj.destination_id, 10) : get(record, 'destination.id', null),
            customer_id: customer.id,
            partner_id: po_data && po_data.partner && po_data.partner.id,
            customer_price: parseFloat(form.customer_price),
            partner_price: isToPay ?  parseFloat(form.partner_price_total) :  parseFloat(form.partner_price),
            ton: form.ton ? form.ton : null,
            per_ton: form.price_per_ton ? parseFloat(form.price_per_ton) : null,
            is_per_ton: !!form.ton,
            bank: isToPay ? 0 : parseFloat(form.bank),
            including_loading: loading_charge,
            including_unloading: unloading_charge,
            cash: isToPay ? parseFloat(form.to_pay_cash) : parseFloat(form.cash),
            to_pay: isToPay ? parseFloat(form.to_pay_balance) : parseFloat(form.to_pay),
            truck_id: po_data && po_data.id,
            truck_type_id: po_data && po_data.truck_type && po_data.truck_type.id,
            driver_id: parseInt(driver_id, 10),
            updated_by: context.email,
            customer_user_id: parseInt(loading_contact_id),
            is_topay: !!isToPay,
            interest_id: origin_name === 4 ? 4 : origin_name === 6 ? 6 : 7,
            customer_advance_percentage: isToPay ? null  : get(customer,'customer_advance_percentage.name',0),
            customer_total_advance: isToPay ? null : total_advance ,
            mamul: isToPay ? null : parseFloat(form.mamul)  
          }
        }) 
    }
  }


  const onSourceChange = (city_id) => {
    setObj({ ...obj, source_id: city_id })
    getCityData(
      {
        variables: { city_id: city_id },
      }
    )
  }

  const onDestinationChange = (city_id) => {
    setObj({ ...obj, destination_id: city_id })
  }

  const onIsToPayChange = (e) => {
    setIsToPay(e.target.checked)
    form.resetFields(isToPay ?
      ['trip_rate_type',
        'price_per_ton', 'ton',
        'customer_price',
        'partner_price_total',
        'customer_to_partner_total',
        'to_pay_cash', 'to_pay_balance']
      :
      ['trip_rate_type',
        'price_per_ton', 'ton',
        'customer_price',
        'partner_price', 'p_total',
        'cash', 'to_pay', 'total',
        'bank', 'balance', 'fp_total',
        'wallet', 'fp_balance'])
  }
  const partner_name = get(po_data, 'partner.name', '-')
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
              <Col xs={24}><h4>{partner_name}</h4></Col>
              <Col xs={24}>
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
            <Form.Item
              label='Customer'
              name='customer'
              initialValue={customer.name}
              labelCol={{ sm: 6 }} wrapperCol={{ sm: 18 }}
              className='mobile-100percent hide-label'
            >
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
                loading_contact_id={setLoading_contact_id}
                driver_id={setDriver_id}
                po_data={po_data && po_data.partner}
                onSourceChange={onSourceChange}
                onDestinationChange={onDestinationChange}
                form={form}
                customer={customer}
                record={record}
                customer_branch_employee_name={obj.source_id ? customer_branch_employee_name : get(record, 'branch_employee.employee.name', null)}
              />}
          </Col>
          <Col xs={24} sm={10}>
            <Checkbox checked={isToPay} onChange={onIsToPayChange}> To Pay </Checkbox>
            {(customer && customer.id) &&
              isToPay ?
              <ToPayPrice
                po_data={po_data && po_data.partner}
                form={form}
                customer={customer}
                record={record}
              /> :
              <PoPrice
                po_data={po_data && po_data.partner}
                form={form}
                customer={customer}
                record={record}
                mamul={mamul}
              />
            }
          </Col>
        </Row>
        {(customer && customer.id) &&
          <Row justify='end'>
            <Divider />
            <Button className='mt10' type='primary' htmlType='submit' loading={disableButton}>Create</Button>
          </Row>}
      </Form>
    </Modal>
  )
}

export default ConfirmPo
