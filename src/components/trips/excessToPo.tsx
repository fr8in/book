import { useState } from 'react'
import { Modal, Form, Select } from 'antd'
import TrucksForPO from './trucksForPO'
import { gql, useQuery } from '@apollo/client'
import ConfirmPo from './confirmPo'
import get from 'lodash/get'

const PARTNER_SEARCH_QUERY = gql`
query partner_search($search: String){
 search_partner(args:{search:$search, status_ids: "{4}"}){
    id
    link
    description
  }
}`

const ExcessToPo = (props) => {
  const { visible, onHide, record } = props

  // const initial = { search: null, partner_id: null, po_visible: false, truck_id: null }
  // const [obj, setObj] = useState(initial)
  const [search,setSearch] = useState(null)
  const [partnerId,setPartnerId] = useState(null)
  const [poVisible,setPoVisible] = useState(false)
  const [truckId,setTruckId] = useState(null)

  const { loading, error, data } = useQuery(
    PARTNER_SEARCH_QUERY,
    {
      variables: { search: search || '' },
      skip: !search,
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

  const [form] = Form.useForm()

  const onPartnerSearch = (value) => {
    setSearch(value)
  }

  const onPartnerSelect = (value, partner) => {
    setPartnerId(partner.key)
    setPoVisible(truckId && partner.key)
  }

  const onTruckSelect = (truck, partner) => {
    setTruckId(truck.id)
    setPoVisible(truck.id || partnerId)
  }
  

  const onClosePoModal = () => {
    setPoVisible(false)
  }

  console.log('search',search,'partnerId',partnerId,'poVisible',poVisible,'truckId',truckId)
  return (
    <>
      <Modal
        visible={visible}
        title='Create PO'
        onCancel={onHide}
        footer={[]}
      >
        <Form form={form}>
          <Form.Item name='partner'>
            <Select
              placeholder='Select Partner'
              showSearch
              disabled={false}
              onSearch={onPartnerSearch}
              onChange={onPartnerSelect}
            >
               {/* {partner_list && 
          <Select.Option key={partner_list.id} value={partner_list.name}>{partner_list.name}</Select.Option>
        } */}
              {partnerSearch && partnerSearch.map(_part => (
                <Select.Option key={_part.id} value={_part.description}>{_part.description}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <TrucksForPO onChange={onTruckSelect} partner_id={partnerId} />
        </Form>
      </Modal>
      {/* {obj.po_visible &&
        <ConfirmPo
          visible={obj.po_visible}
          truck_id={obj.truck_id}
          record={record}
          onHide={onClosePoModal}
          hideExess={onHide}
        />} */}
    </>
  )
}

export default ExcessToPo
