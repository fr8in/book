import { useState } from 'react'
import { Modal, Form, Select, Row, Button, Input } from 'antd'
import TrucksForPO from './trucksForPO'
import { gql, useQuery } from '@apollo/client'
import ConfirmPo from './confirmPo'
import get from 'lodash/get'
import Phone from '../common/phone'

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
  const [form] = Form.useForm()
  const [search, setSearch] = useState(null)
  const [truckId, setTruckId] = useState(null)
  const [truckNo, setTruckNo] = useState(null)
  const [partnerId, setPartnerId] = useState(null)
  const [partnerName, setPartnerName] = useState(null)
  const [partnerMobile, setPartnerMobile] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [poVisible, setPoVisible] = useState(false)

  const { loading, error, data } = useQuery(
    PARTNER_SEARCH_QUERY,
    {
      variables: { search: search || '' },
      skip: !search,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerSearch = get(_data, 'search_partner', [])

  const onPartnerSearch = (value) => {
    setSearch(value)
  }

  const onPartnerSelect = (value, partner) => {
    setPartnerId(partner.key)
    setPoVisible(truckId && partner.key)
  }

  const onTruckSelect = (truck) => {
    setPartnerName(get(truck, 'partner.name', null))
    setPartnerMobile(get(truck, 'partner.partner_users[0].mobile', null))
    setTruckNo(get(truck, 'truck_no', null))
    setTruckId(get(truck, 'id', null))
    setPoVisible(get(truck, 'id', null) || partnerId)
    setPartnerId(get(truck, 'partner.id', null))
  }

  const onClosePoModal = () => {
    setPoVisible(false)
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
        <Form>
          <Form.Item name='partner' >
            {
              truckId ?
                <Input
                  placeholder='Partner Name'
                  defaultValue={partnerName}
                />
                :
                <Select
                  placeholder='Select Partner'
                  showSearch
                  disabled={false}
                  defaultValue={partnerName}
                  onSearch={onPartnerSearch}
                  onChange={onPartnerSelect}
                >
                  {partnerSearch && partnerSearch.map(_partner => (
                    <Select.Option key={_partner.id} value={_partner.description}>{_partner.description}</Select.Option>
                  ))}
                </Select>}
          </Form.Item>
          <TrucksForPO onChange={onTruckSelect} partner_id={partnerId} />
        </Form>
        {truckId ?
          <>
            <Row><p>{partnerName} - {<Phone number={partnerMobile} />}</p></Row>
            <Row><p>Truck No : {truckNo}</p></Row>
            <Row justify='end'>
              <Button type='primary' size='small' onClick={onProceed}>Proceed</Button>
            </Row>
          </>
          : null
        }
      </Modal>
      {showModal &&
        <ConfirmPo
          visible={poVisible}
          truck_id={truckId}
          record={record}
          onHide={onClosePoModal}
          hideExess={onHide}
        />}
    </>
  )
}

export default ExcessToPo
