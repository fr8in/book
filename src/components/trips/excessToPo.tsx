import { useState } from 'react'
import { Modal, Form, Select } from 'antd'
import CreatePo from './createPo'
import TrucksForPO from './trucksForPO'
import { gql, useQuery } from '@apollo/client'

const PARTNER_SEARCH_QUERY = gql`query partner_search($search: String){
search_partner(args:{search:$search}, where:{partner:{partner_status: {name:{_eq:"Active"}}}}){
    id
    link
    description
  }
}`

const ExcessToPo = (props) => {
  const { visible, onHide, record } = props

  const initial = { search: '', partner_id: null, po_data: { ...record }, po_visible: false }
  const [obj, setObj] = useState(initial)

  const [form] = Form.useForm()

  console.log('po_data', obj.po_data)

  const { loading, error, data } = useQuery(
    PARTNER_SEARCH_QUERY,
    {
      variables: { search: obj.search || '' }
    }
  )

  console.log('CreateExcessLoad Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerSearch = _data.search_partner
  const onTruckSelect = (truck, partner) => {
    setObj({ ...obj, po_data: { ...record, ...truck, partner }, po_visible: true })
  }
  const onPartnerSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onPartnerSelect = (value, partner) => {
    setObj({ ...obj, partner_id: partner.key })
    form.resetFields(['truck'])
  }
  const onClosePoModal = () => {
    setObj({ ...obj, po_visible: false })
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
        <CreatePo
          visible={obj.po_visible}
          po_data={obj.po_data}
          onHide={onClosePoModal}
        />}
    </>
  )
}

export default ExcessToPo