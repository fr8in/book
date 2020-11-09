import { useContext } from 'react'
import { Checkbox, Space, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'
import u from '../../lib/util'
import useShowHide from '../../hooks/useShowHide'
import isEmpty from 'lodash/isEmpty'
import PartnerDeactivation from '../partners/partnerDeactivationComment'
import PartnerBlacklist from '../partners/partnerBlacklistComment'

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
  const initial = { dectivate: false,blacklist:false}
  const { visible, onShow, onHide } = useShowHide(initial)
  const partner_status = get(partnerInfo, 'partner_status.name', null)
  const is_blacklisted = (partner_status === 'Blacklisted')
  const is_deactivate = (partner_status === 'De-activate')
  const _admin_role = [role.admin, role.partner_manager,role.bm,role.rm,role.partner_support]
  const _blockAccess_role = [role.admin,role.bm,role.rm,role.onboarding,role.partner_manager, role.partner_support]
  const admin = u.is_roles(_admin_role,context)
  const blockAccess = u.is_roles(_blockAccess_role,context)
  const _edit_access = [role.admin,role.partner_manager, role.onboarding,role.rm,role.bm,role.accounts_manager,role.accounts,role.billing,role.billing_manager,role.partner_support]
  const access = u.is_roles(_edit_access,context)

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
        onClick={() => onShow('blacklist')}
      >
          BlackList
      </Checkbox>
      <Checkbox
        checked={is_deactivate}
        disabled={!blockAccess ? true : admin ? false : !((blockAccess && !is_blacklisted))}
        onClick={() => onShow('dectivate')}
      >
          De-activate
      </Checkbox>
      <Checkbox
        checked={partnerInfo.dnd}
        disabled={!access || is_blacklisted || is_deactivate}
        onChange={dndChange}
      >
          DND
      </Checkbox>
    </Space>
     {visible.dectivate && <PartnerDeactivation visible={visible.dectivate} onHide={onHide} partnerInfo={partnerInfo} />}
     {visible.blacklist && <PartnerBlacklist visible={visible.blacklist} onHide={onHide} partnerInfo={partnerInfo} />}
     </>
  )
}

export default PartnerStatus
