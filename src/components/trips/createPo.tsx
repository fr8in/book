import { useState, useContext } from 'react'
import { Modal, Row, Button, Form, Col, Select, Card, Divider, message } from 'antd'
import Link from 'next/link'
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client'
import PoDetail from './poDetail'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import LinkComp from '../common/link'

const PO_QUERY = gql`
query po_query($id: Int!){
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
}`

const CUSTOMER_PO_DATA = gql`
query customers_po($id:Int!){
  customer(where:{id:{_eq:$id}}){
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
}`

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
      $loading_point_id: Int) {
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
      loading_point_contact_id: $loading_point_id,
      customer_office_id: $loading_point_id,
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
    }) {
      returning {
        id
      }
    }
  }`

const CreatePo = (props) => {
  const { visible, onHide, truck_id } = props
  const [driver_id, setDriver_id] = useState(null)
  const [disableBtn, setDisableBtn] = useState(false)

  const [form] = Form.useForm()
  const initial = { search: '', source_id: null, destination_id: null }
  const [obj, setObj] = useState(initial)
  const context = useContext(userContext)

  const { loading, error, data } = useQuery(
    PO_QUERY,
    {
      variables: { id: truck_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
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

  const [getCustomerData, { loading: cus_loading, data: cus_data, error: cus_error }] = useLazyQuery(CUSTOMER_PO_DATA)

  const [create_po_mutation] = useMutation(
    CREATE_PO,
    {
      onError (error) {
        message.error(error.toString())
        setDisableBtn(false)
      },
      onCompleted (data) {
        const load_id = get(data, 'insert_trip.returning[0].id', null)
        const msg = (
          <span>
            <span>Load&nbsp;</span>
            <LinkComp type='trips' data={load_id} id={load_id} />
            <span>&nbsp;Created!</span>
          </span>
        )
        message.success(msg)
        setObj(initial)
        setDisableBtn(false)
        onHide()
      }
    }
  )

  console.log('CreateExcessLoad Search Error', search_error)
  console.log('CreateExcessLoad Error', error, driver_id)

  let _search_data = {}
  if (!search_loading) {
    _search_data = search_data
  }

  let _cus_data = {}
  if (!cus_loading) {
    _cus_data = cus_data
  }

  const customer = get(_cus_data, 'customer[0]', null)
  const system_mamul = get(customer, 'system_mamul', null)

  if (loading) return null

  const customerSearch = get(_search_data, 'search_customer', '')
  const po_data = get(data, 'truck[0]', null)

  const onSubmit = (form) => {
    const loading_charge = form.charge_inclue.includes('Loading')
    const unloading_charge = form.charge_inclue.includes('Unloading')
    if (system_mamul > parseFloat(form.mamul)) {
      message.error('Mamul Should be greater than system mamul!')
    } else {
      setDisableBtn(true)
      create_po_mutation({
        variables: {
          po_date: form.po_date.format('YYYY-MM-DD'),
          source_id: parseInt(obj.source_id, 10),
          destination_id: parseInt(obj.destination_id, 10),
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
          driver_id: driver_id,
          created_by: context.email,
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

  const onCusSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onCusSelect = (value, customer) => {
    getCustomerData({
      variables: { id: customer.key }
    })
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
        <Link href='trucks/[id]' as={`trucks/${po_data.truck_no}`}>
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
          {!cus_loading && (customer && customer.id) &&
            <div>
              <PoDetail
                driver_id={setDriver_id}
                po_data={po_data && po_data.partner}
                onSourceChange={onSourceChange}
                onDestinationChange={onDestinationChange}
                form={form}
                customer={customer}
                loading={cus_loading}
              />
              <Divider className='hidden-xs' />
              <div className='text-right'>
                <Button type='primary' htmlType='submit' loading={disableBtn}>Create</Button>
              </div>
            </div>}
        </Card>
      </Form>
    </Modal>
  )
}

export default CreatePo
