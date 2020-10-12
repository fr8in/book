import { useState } from 'react'
import { Modal, Form, Select } from 'antd'
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

const ExcessToPo = (props) => {
  const { visible, onHide, record } = props

  const initial = { search: null, partner_id: null, po_visible: false, truck_id: null }
  const [obj, setObj] = useState(initial)

  const [form] = Form.useForm()

  console.log('po_data', record)

  const { loading, error, data } = useQuery(
    PARTNER_SEARCH_QUERY,
    {
      variables: { search: obj.search || '' },
      skip: !obj.search
    }
  )

  console.log('CreateExcessLoad Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerSearch = get(_data, 'search_partner', [])
  console.log('partnerSearch', partnerSearch)
  const onPartnerSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onPartnerSelect = (value, partner) => {
    setObj({ ...obj, partner_id: partner.key })
    form.resetFields(['truck'])
  }

  const onTruckSelect = (truck, partner) => {
    setObj({ ...obj, truck_id: truck.id, po_visible: true })
  }

  const onClosePoModal = () => {
    setObj(initial)
  }
  console.log('obj_data', obj)
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
              {partnerSearch && partnerSearch.map(_part => (
                <Select.Option key={_part.id} value={_part.description}>{_part.description}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <TrucksForPO onChange={onTruckSelect} partner_id={obj.partner_id} />
        </Form>
      </Modal>
      {obj.po_visible &&
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
