import { useState,useEffect } from 'react'
import { Modal, Form, Select, Row, Col, Button } from 'antd'
import TrucksForPO from './trucksForPO'
import { gql, useQuery } from '@apollo/client'
import ConfirmPo from './confirmPo'
import get from 'lodash/get'

const PARTNER_SEARCH_QUERY = gql`query partner_search($search: String){
search_partner(args:{search:$search, status_ids: "{4}"}){
    id
    link
    description
  }
}`

const PARTNER_FOR_PO_QUERY = gql`
query truck_po_creation($id: Int!) {
  truck(where: {id: {_eq: $id}}) {
    id
    truck_no
    truck_type {
      id
      name
    }
    partner {
      id
      cardcode
      name
      partner_users(where:{is_admin:{_eq:true}}){
        mobile
      }
    }
  }
}`

const ExcessToPo = (props) => {
  const { visible, onHide, record } = props

  const initial = { search: null, partner_id: null, po_visible: false, truck_id: null }
  const [obj, setObj] = useState(initial)
const [showModal,setShowModal] = useState(false)
const [partnerId,setPartnerId]=useState(null)

  const { loading, error, data } = useQuery(
    PARTNER_SEARCH_QUERY,
    {
      variables: { search: obj.search || '' },
      skip: !obj.search,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('CreateExcessLoad Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerSearch = get(_data, 'search_partner', [])

  const { loading: partnerPoLoading, error: partnerPoError, data: partnerPoData } = useQuery(
    PARTNER_FOR_PO_QUERY,
    {
      variables: { id: obj.truck_id },
      skip: !obj.truck_id,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _partnerPoData = {}
  if (!partnerPoLoading) {
    _partnerPoData = partnerPoData
  }

  useEffect(()=>{
    if(!loading){
      setPartnerId(get(partnerPoData, 'truck[0].partner.id', []))
    }
  },[loading])
  const [form] = Form.useForm()

  const truck = get(_partnerPoData, 'truck[0]', [])
  const truck_no = get(truck,'truck_no', null)
  const partner_list = get(truck, 'partner', null)
  const partner_name = get(partner_list, 'name', null)
  const partner_mobile = get(partner_list, 'partner_users[0].mobile', null)
  const partner_id = get(partner_list, 'id', null)

  console.log('TrucksForPO Error', partner_name)

  const onPartnerSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onPartnerSelect = (value, partner) => {
    setObj({ ...obj, partner_id: partner.key, po_visible: (obj.truck_id && partner.key) })
     }

  const onTruckSelect = (truck, partner) => {
    console.log('TrucksForPO data', partner)
    setObj({ ...obj, truck_id: truck.id, po_visible: (truck.id || obj.partner_id) })
  }

  const onClosePoModal = () => {
    setObj(initial)
  }
  const onProceed = () => {
    setShowModal(true)
  }

  return (
    <>
      <Modal
        visible={visible}
        title='Create PO'
        onCancel={onHide}
        footer={[]}
      >
        <Form form={form}>
          <Form.Item name='partner' initialValue={partner_list && partner_list.name}>
            <Select
              placeholder='Select Partner'
              showSearch
              //defaultValue={partner_list && partner_list.name}
              value={partnerId}
              disabled={false}
              onSearch={onPartnerSearch}
              onChange={onPartnerSelect}
            >
              {partner_list &&
                <Select.Option key={partner_list.id} value={partner_list.name}>{partner_list.name}</Select.Option>
              }
              {partnerSearch && partnerSearch.map(_part => (
                <Select.Option key={_part.id} value={_part.description}>{_part.description}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <TrucksForPO onChange={onTruckSelect} partner_id={obj.partner_id} />
          {
            obj.truck_id &&
            <> 
              <Row>{partner_name} - {partner_mobile} </Row>
              <Row>
                <Col xs={12}>TruckNo: {truck_no}</Col>
                <Col xs={12} className='text-right'>
                  <Button type='primary' size='small' disabled={!obj.truck_id || !obj.partner_id} onClick={onProceed}>Proceed</Button>
                </Col>
              </Row>
            </>
          }
        </Form>
      </Modal>
      {showModal &&
        <ConfirmPo
          visible={obj.po_visible}
          truck_id={obj.truck_id}
          record={record}
          onHide={onClosePoModal}
          hideExess={onHide}
        />}
    </>
  )
}

export default ExcessToPo
