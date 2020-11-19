import { Modal, Select,Form,message } from 'antd'
import { gql, useQuery ,useMutation} from '@apollo/client'
import { useState } from 'react'
import get from 'lodash/get'

const PARTNER_SEARCH_QUERY = gql`query partner_search($search: String){
    search_partner(args:{search:$search, status_ids: "{4}"}){
        id
        link
        description
      }
    }`

    const UPDATE_PARTNER_REFERRED_NAME_MUTATION = gql`
mutation update_owner($id:[Int!],$referral_id:Int) {
  update_partner(_set: {referral_id: $referral_id}, where: {id: {_in: $id}}) {
    returning {
      id
    }
  }
}`


const ReferredByPartnerList = (props) => {
  const { visible, onHide,partner_id ,initialValue} = props
  const initial = { search: null, partner_id: null }
  const [obj, setObj] = useState(initial)
 


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


  const [updatePartnerReferredName] = useMutation(
    UPDATE_PARTNER_REFERRED_NAME_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () {
         message.success('Updated!!')
        onHide()
       }
    }
  )

  const onPartnerSelect = (partner,option) => {
    console.log('partner',option)
    updatePartnerReferredName({
      variables: {
        id:partner_id,
        referral_id:option.key
      }
    })
  }

  return (
    <Modal
      visible={visible}
      onCancel={onHide}
      footer={[]}
    >
    <Form.Item name='partner' initialValue={initialValue}>
            <Select
              placeholder='Select Partner'
              showSearch
              disabled={false}
              style={{ width: 300 }}
              onSearch={onPartnerSearch}
              onChange={onPartnerSelect}
            >
              {partnerSearch && partnerSearch.map(_part => (
                <Select.Option key={_part.id} value={_part.description}>{_part.description}</Select.Option>
              ))}
            </Select>
            </Form.Item>
            </Modal>
  )
}

export default ReferredByPartnerList
