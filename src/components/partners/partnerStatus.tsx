import { useContext } from 'react'
import { Checkbox, Space, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import u from '../../lib/util'
import useShowHide from '../../hooks/useShowHide'
import isEmpty from 'lodash/isEmpty'
import PartnerDeactivation from '../partners/partnerDeactivationComment'

const UPDATE_PARTNER_BLACKLIST_MUTATION = gql`
mutation partner_blacklist($id: Int!, $updated_by: String!) {
  partner_blacklist(id: $id, updated_by: $updated_by) {
   description
   status
  }
}`

const UPDATE_PARTNER_UNBLACKLIST_MUTATION = gql`
mutation partner_unblacklist($id: Int!, $updated_by: String!) {
  partner_unblacklist(id: $id, updated_by: $updated_by) {
    description
    status
  }
}`


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
  const initial = { dectivate: false}
  const { visible, onShow, onHide } = useShowHide(initial)
  const partner_status = get(partnerInfo, 'partner_status.name', null)
  const is_blacklisted = (partner_status === 'Blacklisted')
  const is_deactivate = (partner_status === 'De-activate')
  const admin_role = [role.admin, role.partner_manager, role.partner_support]
  const blockAccess_role = [role.admin, role.rm, role.onboarding, role.partner_manager, role.partner_support]
  const admin = !isEmpty(admin_role) ? context.roles.some(r => admin_role.includes(r)) : false
  const blockAccess = !isEmpty(blockAccess_role) ? context.roles.some(r => blockAccess_role.includes(r)) : false

  const [updateBlacklist] = useMutation(
    UPDATE_PARTNER_BLACKLIST_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const status = get(data, 'partner_blacklist.status', null)
        const description = get(data, 'partner_blacklist.description', null)
        if (status === 'OK') {
          message.success(description || 'Blacklisted!!')
        } else {
          message.error(description || 'Error Occured!!')
        }
      }
    }
  )

  const [updateUnblacklist] = useMutation(
    UPDATE_PARTNER_UNBLACKLIST_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const status = get(data, 'partner_unblacklist.status', null)
        const description = get(data, 'partner_unblacklist.description', null)
        if (status === 'OK') {
          message.success(description || 'Unblacklisted!!')
        } else {
          message.error(description || 'Error Occured!!')
        }
      }
    }
  )

  const blacklistChange = (e) => {
    if (e.target.checked) {
      updateBlacklist({
        variables: {
          id: partnerInfo.id,
          updated_by: context.email
        }
      })
    } else {
      updateUnblacklist({
        variables: {
          id: partnerInfo.id,
          updated_by: context.email
        }
      })
    }
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
    <>
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
        onClick={() => onShow('dectivate')}
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
     {visible.dectivate && <PartnerDeactivation visible={visible.dectivate} onHide={onHide} partnerInfo={partnerInfo} />}
     </>
  )
}

export default PartnerStatus
