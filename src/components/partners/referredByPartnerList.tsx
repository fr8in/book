import { Modal, Select,Form } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import get from 'lodash/get'

const PARTNER_SEARCH_QUERY = gql`query partner_search($search: String){
    search_partner(args:{search:$search, status_ids: "{4}"}){
        id
        link
        description
      }
    }`


const ReferredByPartnerList = (props) => {
  const { visible, onHide,partner_id } = props
  const initial = { search: null, partner_id: null }
  const [obj, setObj] = useState(initial)

  const [form] = Form.useForm()

  const { loading, error, data } = useQuery(
    PARTNER_SEARCH_QUERY,
    {
      variables: { search: obj.search || '' },
      skip: !obj.search,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('ReferredByPartnerList Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const partnerSearch = get(_data, 'search_partner', [])
  const onPartnerSearch = (value) => {
    setObj({ ...obj, search: value })
  }

  const onPartnerSelect = (value, partner) => {
    setObj({ ...obj, partner_id: partner.key })
  }

 

  return (
    <Modal
      visible={visible}
      onCancel={onHide}
    >
     <Form form={form}>
          <Form.Item name='name'>
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
   </Form>
    </Modal>
  )
}

export default ReferredByPartnerList
