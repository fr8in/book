import { Switch, Tooltip, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../lib/util'

const UPDATE_PARTNER_WALLET_BLOCK_STATUS_MUTATION = gql`
mutation partner_wallet_block ($id:Int!,$updated_by:String!){
  partner_wallet_block(id: $id, updated_by:$updated_by ) {
    description
    status
  }
}
`
const UPDATE_PARTNER_WALLET_UNBLOCK_STATUS_MUTATION = gql`
mutation partner_wallet_Unblock ($id:Int!,$updated_by:String!) {
  partner_wallet_unblock(id: $id, updated_by: $updated_by) {
    description
    status
  }
}`

const PartnerStatus = (props) => {
  const { id, status } = props
  const context = useContext(userContext)
  const { role } = u
  const _edit_access = [role.admin, role.partner_manager, role.onboarding,role.rm,role.bm,role.accounts_manager,role.accounts,role.billing,role.billing_manager,role.partner_support]
  const access = u.is_roles(_edit_access,context)
  const _wallet_unblock = [role.admin, role.rm,role.bm,role.partner_manager,role.partner_support]
  const wallet_unblock_roles = u.is_roles(_wallet_unblock,context)

  const [updateStatusId] = useMutation(
    UPDATE_PARTNER_WALLET_BLOCK_STATUS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const [updateStatus] = useMutation(
    UPDATE_PARTNER_WALLET_UNBLOCK_STATUS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onblock = () => {
    updateStatusId({
      variables: {
        id: id,
        updated_by: context.email
      }
    })
  }

  const onunblock = () => {
    updateStatus({
      variables: {
        id: id,
        updated_by: context.email
      }
    })
  }

  const blacklisted = (status || status === null) // wallet_block null also blacklisted
  const onchange = blacklisted ? onunblock : onblock

  return (
    <Tooltip title={blacklisted ? 'Unblock Wallet' : 'Block Wallet'}>
      <Switch
        onChange={onchange}
        checked={blacklisted}
        className={blacklisted ? 'block' : 'unblock'}
        disabled={!wallet_unblock_roles ? true : !access}
      />
    </Tooltip>
  )
}

export default PartnerStatus
