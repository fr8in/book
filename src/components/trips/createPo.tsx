import { useState, useContext } from 'react'
import { Modal, Row, Button, Form, Col, Select, Divider, message, Checkbox } from 'antd'
import Link from 'next/link'
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client'
import PoDetail from './poDetail'
import PoPrice from './poPrice'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import Truncate from '../common/truncate'
import ToPayPrice from '../trips/toPayPrice'

const PO_QUERY = gql`
query po_query($id: Int!){
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

const CUSTOMER_PO_DATA = gql`
query customers_po($id:Int!){
  customer(where:{id:{_eq:$id}}){
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
  }
  config(where:{key:{_eq:"trip"}}){
    value
  }
}`

const TRIP_DATA = gql`
query ($customer_id: Int!, $source_id: Int!, $destination_id: Int!, $type_id: Int!) {
  trip(where: {customer_id: {_eq: $customer_id}, source_id: {_eq: $source_id}, destination_id: {_eq: $destination_id}, truck_type: {id: {_eq: $type_id}},trip_status_id:{_eq:1}}) {
    id
    trip_status{
      name
    }
  }
}
`

const CUSTOMER_SEARCH = gql`query cus_search($search:String!){
  search_customer(args:{search:$search, status_ids: "{1,5}"}){
    id
    description
  }
}`
//, where:{customer:{status:{name:{_eq:"Active"}}}}
const CREATE_PO = gql`
mutation create_po (
  $po_date: timestamp,
  $source_id: Int, 
  $created_by: String!
  $destination_id: Int, 
  $customer_id: Int,
  $partner_id:Int,
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
  $truck_id:Int,
  $truck_type_id: Int,
  $driver_id: Int,
  $is_topay: Boolean,
  $customer_user_id: Int,
  $origin_id:Int,
  $customer_advance_percentage:Int,
  $customer_total_advance:Float,
  $interest_id:Int) {
insert_trip(objects: {
  po_date:$po_date
  source_id: $source_id, 
  created_by: $created_by
  destination_id: $destination_id, 
  customer_id: $customer_id,
  partner_id: $partner_id,
  truck_id: $truck_id,
  truck_type_id: $truck_type_id,
  driver_id: $driver_id,
  customer_user_id: $customer_user_id,
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
  origin_id:$origin_id,
  interest_id:$interest_id,
  customer_total_advance:$customer_total_advance
  customer_advance_percentage:$customer_advance_percentage
}) {
  returning {
    id
  }
}
}`

const UPDATE_PO = gql`
mutation update_po(
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
  $origin_id:Int,
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
    origin_id:$origin_id,
    interest_id:$interest_id,
    customer_total_advance:$customer_total_advance,
    customer_advance_percentage:$customer_advance_percentage
  }, 
  where:{id:{_eq:$trip_id}}){
    returning{
      id
    }
  }
}
`

const CreatePo = (props) => {
  const { visible, onHide, truck_id } = props
  const [loading_contact_id, setLoading_contact_id] = useState(null)
  const [driver_id, setDriver_id] = useState(null)
  const [disableBtn, setDisableBtn] = useState(false)
  const [isToPay, setIsToPay] = useState(false)
  

  const [form] = Form.useForm()
  const initial = { search: '', source_id: null, destination_id: null }
  const [obj, setObj] = useState(initial)
  const context = useContext(userContext)

  const { loading, error, data } = useQuery(
    PO_QUERY,
    {
      variables: { id: truck_id  },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true 
    }
  )

  const [getCityData,{ loading: city_loading, error:city_error, data:_city_data }] = useLazyQuery(CITY_DATA,
    {
      onCompleted (data) {
          if(!get(data,'city[0].branch.id',null)) {
      message.warning("Selected source city doesn't mapped with branch")
          } else {
            getCustomerBranchData({
              variables: {
                customer_id:get(customer,'id',null),
                type_id:get(po_data,'truck_type.truck_type_group_id',null),
                branch_id:get(data,'city[0].branch.id',null)
              }
            })
          }
      }
    }
    )

  const { loading: search_loading, error: search_error, data: search_data } = useQuery(
    CUSTOMER_SEARCH,
    {
      variables: { search: obj.search || '' },
      skip: !(obj.search),
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )



const [getTripData, { loading: trip_loading, data: trip_data, error: trip_error }] = useLazyQuery(TRIP_DATA,
  {
    onCompleted (data) {
      const id = get(data,'trip[0].id', null)
      id ? onUpdatePo() : onCreatePo()
}
  }
  )

let _trip_data = {}
if (!trip_loading) {
  _trip_data = trip_data
}


const trip_id = get(_trip_data, 'trip[0].id', null)


  const [getCustomerData, { loading: cus_loading, data: cus_data, error: cus_error }] = useLazyQuery(CUSTOMER_PO_DATA)

   const [getCustomerBranchData, { loading: customer_branch_loading, data: customer_branch_data, error: customer_branch_error }] = useLazyQuery(CUSTOMER_BRANCH_EMPLOYEE_DATA)


  const [create_po_mutation] = useMutation(
    CREATE_PO,
    {
      onError (error) {
        const msg = get(error, 'graphQLErrors[0].extensions.internal.error.message', error.toString())
        message.error(msg)
        setDisableBtn(false)
      },
      onCompleted (data) {
        const load_id = get(data, 'insert_trip.returning[0].id', null)
        message.success(`Load: ${load_id} Created!`)
        setObj(initial)
        setDisableBtn(false)
        onHide()
      }
    }
  )


  const [updatePo] = useMutation(
    UPDATE_PO,
    {
      onError (error) {
       
        message.error(error.toString())
      },
      onCompleted () {
        message.success(`Load: ${trip_id} Updated!`)
      onHide()
     }

    }
  )

  console.log('CreateExcessLoad Search Error', search_error)

  let _search_data = {}
  if (!search_loading) {
    _search_data = search_data
  }

  let _cus_data = {}
  if (!cus_loading) {
    _cus_data = cus_data
  }

  const customer = get(_cus_data, 'customer[0]', null)
  const trip_max_price = get(_cus_data, 'config[0].value.trip_max_price', null)
  const system_mamul = get(customer, 'system_mamul', null)
  const standard_mamul = get(customer, 'standard_mamul', null)

  const mamul = Math.max(system_mamul, standard_mamul)
  if (loading) return null

  const customerSearch = get(_search_data, 'search_customer', '')
  const po_data = get(data, 'truck[0]', null)

 
 

  let customer_data = {}
  if (!customer_branch_loading) {
    customer_data = customer_branch_data
  }
  

  const customer_branch_employee = get(customer_data, 'customer_branch_employee[0]', [])
    const customer_branch_employee_name = get(customer_branch_employee,'branch_employee.employee.name',null)

    const onTripDataChange = (form) => {
      getTripData(
        {
          variables:{
            source_id: parseInt(obj.source_id, 10),
            destination_id: parseInt(obj.destination_id, 10),
            customer_id: customer.id,
            type_id: get(po_data,'truck_type.id',null)
          }
        }
      )
    }

   

    const onUpdatePo = () => {
      const loading_charge = form.getFieldValue('charge_inclue').includes('Loading')
    const unloading_charge = form.getFieldValue('charge_inclue').includes('Unloading')
    if (form.getFieldValue('customer_price') > trip_max_price) {
      message.error(`Trip max price limit ₹${trip_max_price}`)
    } else if (form.getFieldValue('customer_price') <= 0) {
      message.error('Enter valid trip price')
    } else if (parseInt(form.getFieldValue('p_total')) < parseInt(form.getFieldValue('cash'))) {
      message.error('Customer to Partner, Total and cash is miss matching')
    } else if (parseInt(form.getFieldValue('p_total')) > form.getFieldValue('customer_price')) {
      message.error('Customer to Partner should be less than or euqal to customer price')
    } else if (mamul > parseFloat(form.getFieldValue('mamul'))) {
      message.error('Mamul Should be greater than system mamul!')
    } else {
      setDisableBtn(true)
      const total_advance = parseFloat(form.getFieldValue('bank'))+parseFloat(form.getFieldValue('cash'))+parseFloat(form.getFieldValue('to_pay'))
      updatePo({
        variables: {
          trip_id:trip_id,
          po_date: form.getFieldValue('po_date').format('YYYY-MM-DD'),
          source_id: parseInt(obj.source_id, 10),
          destination_id: parseInt(obj.destination_id, 10),
          customer_id: customer.id,
          partner_id: po_data && po_data.partner && po_data.partner.id,
          customer_price: parseFloat(form.getFieldValue('customer_price')),
          partner_price: isToPay ? parseFloat(form.getFieldValue('partner_price_total')) : parseFloat(form.getFieldValue('partner_price')),
          ton: form.getFieldValue('ton') ? form.getFieldValue('ton') : null,
          per_ton: form.getFieldValue('price_per_ton') ? parseFloat(form.getFieldValue('price_per_ton')) : null,
          is_per_ton: !!form.getFieldValue('ton'),
          including_loading: loading_charge,
          including_unloading: unloading_charge,
          bank: isToPay ? 0 : parseFloat(form.getFieldValue('bank')),
          cash: isToPay ?  parseFloat(form.getFieldValue('to_pay_cash')) :  parseFloat(form.getFieldValue('cash')),
          to_pay: isToPay ?  parseFloat(form.getFieldValue('to_pay_balance')) : parseFloat(form.getFieldValue('to_pay')),
          truck_id: po_data && po_data.id,
          truck_type_id: po_data && po_data.truck_type && po_data.truck_type.id,
          driver_id: driver_id,
          updated_by: context.email,
          customer_user_id: parseInt(loading_contact_id),
          is_topay: !!isToPay,
          origin_id: 7,
          interest_id:7,
           mamul: !isToPay ? parseFloat(form.getFieldValue('mamul')) : null,
           customer_advance_percentage:!isToPay ? get(customer,'customer_advance_percentage.name',0) : null,
           customer_total_advance:!isToPay ? total_advance : null
        }
      }) 
    }
    }


  const onCreatePo = () => {
    const loading_charge = form.getFieldValue('charge_inclue').includes('Loading')
    const unloading_charge = form.getFieldValue('charge_inclue').includes('Unloading')
    if (form.getFieldValue('customer_price') > trip_max_price) {
      message.error(`Trip max price limit ₹${trip_max_price}`)
    } else if (form.getFieldValue('customer_price') <= 0) {
      message.error('Enter valid trip price')
    } else if (parseInt(form.getFieldValue('p_total')) < parseInt(form.getFieldValue('cash'))) {
      message.error('Customer to Partner, Total and cash is miss matching')
    } else if (parseInt(form.getFieldValue('p_total')) > form.getFieldValue('customer_price')) {
      message.error('Customer to Partner should be less than or euqal to customer price')
    } else if (mamul > parseFloat(form.getFieldValue('mamul'))) {
      message.error('Mamul Should be greater than system mamul!')
    } else {
      setDisableBtn(true)
      const total_advance = parseFloat(form.getFieldValue('bank'))+parseFloat(form.getFieldValue('cash'))+parseFloat(form.getFieldValue('to_pay'))
      create_po_mutation({
        variables: {
          po_date: form.getFieldValue('po_date').format('YYYY-MM-DD'),
          source_id: parseInt(obj.source_id, 10),
          destination_id: parseInt(obj.destination_id, 10),
          customer_id: customer.id,
          partner_id: po_data && po_data.partner && po_data.partner.id,
          customer_price: parseFloat(form.getFieldValue('customer_price')),
          partner_price: isToPay ? parseFloat(form.getFieldValue('partner_price_total')) : parseFloat(form.getFieldValue('partner_price')),
          ton: form.getFieldValue('ton') ? form.getFieldValue('ton') : null,
          per_ton: form.getFieldValue('price_per_ton') ? parseFloat(form.getFieldValue('price_per_ton')) : null,
          is_per_ton: !!form.getFieldValue('ton'),
          including_loading: loading_charge,
          including_unloading: unloading_charge,
          bank: isToPay ? 0 : parseFloat(form.getFieldValue('bank')),
          cash: isToPay ?  parseFloat(form.getFieldValue('to_pay_cash')) :  parseFloat(form.getFieldValue('cash')),
          to_pay: isToPay ?  parseFloat(form.getFieldValue('to_pay_balance')) : parseFloat(form.getFieldValue('to_pay')),
          truck_id: po_data && po_data.id,
          truck_type_id: po_data && po_data.truck_type && po_data.truck_type.id,
          driver_id: driver_id,
          created_by: context.email,
          customer_user_id: parseInt(loading_contact_id),
          is_topay: !!isToPay,
          origin_id: 7,
          interest_id:7,
           mamul: !isToPay ? parseFloat(form.getFieldValue('mamul')) : null,
           customer_advance_percentage:!isToPay ? get(customer,'customer_advance_percentage.name',0) : null,
           customer_total_advance:!isToPay ? total_advance : null
        }
      }) 
    }
  }

 
 
  const onSourceChange = (city_id) => {
    setObj({ ...obj, source_id: city_id })
    getCityData(
      {
        variables: {city_id:city_id},
      }
    )
  }

  const onDestinationChange = (city_id) => {
    setObj({ ...obj, destination_id: city_id })
  }

  const onCusSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onCusSelect = (value, customer) => {
    getCustomerData({
      variables: { id: customer.key }
    })
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
  const layout = {
    labelCol: { xs: 12 },
    wrapperCol: { xs: 12 }
  }
  return (
    <Modal
      visible={visible}
      onOk={onTripDataChange}
      onCancel={onHide}
      width={900}
      style={{ top: 10 }}
      bodyStyle={{ paddingBottom: 0 }}
      footer={[]}
      className='no-header'
    >
      <Form form={form} className='create-po form-sheet' labelAlign='left' colon={false} {...layout} onFinish={onTripDataChange}>
        <Row gutter={20}>
          <Col xs={24} sm={14}>
            <Row>
              <Col xs={12}><h4>PO: <Truncate data={partner_name} length={12} /></h4></Col>
              <Col xs={12} className='text-right'>
                <Link href='trucks/[id]' as={`trucks/${po_data && po_data.truck_no}`}>
                  <a>{po_data.truck_no}</a>
                </Link>
              </Col>
            </Row>
            <Form.Item
              label='Customer'
              name='customer'
              rules={[{ required: true }]}
              labelCol={{ sm: 6 }} wrapperCol={{ sm: 18 }}
              className='mobile-100percent hide-label'
            >
              <Select
                placeholder='Customer'
                showSearch
                disabled={false}
                onSearch={onCusSearch}
                onChange={onCusSelect}
                size='small'
              >
                {customerSearch && customerSearch.map(_cus => (
                  <Select.Option key={_cus.id} value={_cus.description}>{_cus.description}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            {!cus_loading && (customer && customer.id) &&
              <PoDetail
                loading_contact_id={setLoading_contact_id}
                driver_id={setDriver_id}
                po_data={po_data && po_data.partner}
                onSourceChange={onSourceChange}
                onDestinationChange={onDestinationChange}
                form={form}
                customer={customer}
                loading={cus_loading}
                customer_branch_employee_name={customer_branch_employee_name}
              />}
          </Col>
          <Col xs={24} sm={10}>
          {!cus_loading && (customer && customer.id) &&
          <>
         <Checkbox checked={isToPay} onChange={onIsToPayChange}> To Pay </Checkbox> 
            { isToPay ?
             <ToPayPrice
                po_data={po_data && po_data.partner}
                form={form}
                customer={customer}
                loading={cus_loading}
              />:
              <PoPrice
                po_data={po_data && po_data.partner}
                form={form}
                customer={customer}
                loading={cus_loading}
                mamul={mamul}
              />}
              </>}
          </Col>
        </Row>
        {!cus_loading && (customer && customer.id) &&
          <Row justify='end'>
            <Divider />
            <Button className='mt10' type='primary' htmlType='submit' loading={disableBtn}>Create</Button>
          </Row>}
      </Form>
    </Modal>
  )
}

export default CreatePo
