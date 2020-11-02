import { Switch, Tooltip } from 'antd'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import useShowHide from '../../hooks/useShowHide'
import u from '../../lib/util'
import WalletStatusComment from '../partners/walletStatusComment'

const PartnerStatus = (props) => {
  const { id, status } = props
  const context = useContext(userContext)
  const initial = { walletStatus: false}
  const { visible, onShow, onHide } = useShowHide(initial)
  const { role } = u
  const _edit_access = [role.admin, role.partner_manager, role.onboarding,role.rm,role.bm,role.accounts_manager,role.accounts,role.billing,role.billing_manager,role.partner_support,role.user]
  const access = u.is_roles(_edit_access,context)
  const _wallet_unblock = [role.admin, role.rm,role.bm,role.partner_manager,role.partner_support,role.user]
  const wallet_unblock_roles = u.is_roles(_wallet_unblock,context)


  const blacklisted = (status || status === null) // wallet_block null also blacklisted
  

  return (
    <>
    <Tooltip title={blacklisted ? 'Unblock Wallet' : 'Block Wallet'}>
      <Switch
        onClick={() => onShow('walletStatus')}
        checked={blacklisted}
        className={blacklisted ? 'block' : 'unblock'}
        disabled={!wallet_unblock_roles ? true : !access}
      />
    </Tooltip>
    {visible.walletStatus && <WalletStatusComment visible={visible.walletStatus} onHide={onHide} partne={id} status={status}/>}
    </>
  )
}

export default PartnerStatus
