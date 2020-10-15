import { useContext } from 'react'
import { Checkbox, Space, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'

const UPDATE_PARTNER_BLACKLIST_MUTATION = gql`
mutation partner_blacklist($partner_status_id:Int,$cardcode:String!, $updated_by: String){
  update_partner( _set: {partner_status_id: $partner_status_id, updated_by: $updated_by}, where: {cardcode:{_eq: $cardcode}} 
  ){
    returning{
      cardcode
      partner_status_id
    }
  }
}
`
const UPDATE_PARTNER_DE_ACTIVATE_MUTATION = gql`
mutation partner_de_activate($partner_status_id:Int,$cardcode:String!, $updated_by: String){
  update_partner( _set: {partner_status_id: $partner_status_id, updated_by: $updated_by}, where: {cardcode:{_eq: $cardcode}} 
  ){
    returning{
      cardcode
      partner_status_id
    }
  }
}
`

const UPDATE_PARTNER_DND_MUTATION = gql`
mutation partner_dnd($dnd:Boolean,$cardcode:String!,$updated_by: String) {
  update_partner(_set: {dnd: $dnd, updated_by: $updated_by}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      cardcode
      dnd
    }
  }
}
`

const PartnerStatus = (props) => {
  const { partnerInfo } = props
  const { role } = u
  const context = useContext(userContext)
  const partner_status = get(partnerInfo, 'partner_status.name', null)
  const is_blacklisted = (partner_status === 'Blacklisted')
  const is_deactivate = (partner_status === 'De-activate')
  const admin_role =[role.admin, role.partner_manager, role.partner_support]
  const blockAccess_role = [role.admin, role.rm, role.onboarding, role.partner_manager, role.partner_support]
  const admin = !isEmpty(admin_role) ? context.roles.some(r => admin_role.includes(r)) : false
  const blockAccess = !isEmpty(blockAccess_role) ? context.roles.some(r => blockAccess_role.includes(r)) : false
  

  const [updateBlacklist] = useMutation(
    UPDATE_PARTNER_BLACKLIST_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const blacklistChange = (e) => {
    updateBlacklist({
      variables: {
        cardcode: partnerInfo.cardcode,
        partner_status_id: e.target.checked ? 7 : 4,
        updated_by: context.email
      }
    })
  }

  const [updateDeactivate] = useMutation(
    UPDATE_PARTNER_DE_ACTIVATE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const deActivateChange = (e) => {
    updateDeactivate({
      variables: {
        cardcode: partnerInfo.cardcode,
        partner_status_id: e.target.checked ? 6 : 4,
        updated_by: context.email
      }
    })
  }

  const [updateDnd] = useMutation(
    UPDATE_PARTNER_DND_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
  const dndChange = (e) => {
    updateDnd({
      variables: {
        cardcode: partnerInfo.cardcode,
        dnd: e.target.checked,
        updated_by: context.email
      }
    })
  }

  return (
    <Space>
      <Checkbox
        checked={is_blacklisted}
        disabled={!blockAccess ? true : admin ? false : !((blockAccess && !is_blacklisted))}
        onChange={blacklistChange}
      >
          BlackList
      </Checkbox>
      <Checkbox
        checked={is_deactivate}
        disabled={!blockAccess ? true : !((blockAccess && !is_blacklisted))}
        onChange={deActivateChange}
      >
          De-activate
      </Checkbox>
      <Checkbox
        checked={partnerInfo.dnd}
        disabled={!blockAccess || is_blacklisted || is_deactivate}
        onChange={dndChange}
      >
          DND
      </Checkbox>
    </Space>
  )
}

export default PartnerStatus
