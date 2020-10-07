import { Switch, Tooltip, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import userContext from '../../lib/userContaxt'
import { useContext } from 'react'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'

const UPDATE_PARTNER_WALLET_STATUS_MUTATION = gql`
mutation partner_wallet_status($wallet_block:Boolean,$cardcode:String,$updated_by: String!) {
  update_partner(_set: {wallet_block:$wallet_block,updated_by:$updated_by}, where: {cardcode: {_eq:$cardcode}}) {
    returning {
      id
      wallet_block
    }
  }
}
`
const PartnerStatus = (props) => {
  const { cardcode, status } = props
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const [updateStatusId] = useMutation(
    UPDATE_PARTNER_WALLET_STATUS_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const onChange = (checked) => {
    updateStatusId({
      variables: {
        cardcode,
        wallet_block: checked,
        updated_by: context.email
      }
    })
  }
  const blacklisted = status

  return (
    <Tooltip title={blacklisted ? 'Unblock Wallet' : 'Block Wallet'}>
      <Switch
        onChange={onChange}
        checked={blacklisted}
        className={blacklisted ? 'block' : 'unblock'}
        disabled={!access}
      />
    </Tooltip>
  )
}

export default PartnerStatus
