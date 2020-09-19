import { Switch, Tooltip, message } from 'antd'
import { gql, useMutation } from '@apollo/client'

const UPDATE_PARTNER_WALLET_STATUS_MUTATION = gql`
mutation partner_wallet_status($wallet_block:Boolean,$cardcode:String) {
  update_partner(_set: {wallet_block:$wallet_block}, where: {cardcode: {_eq:$cardcode}}) {
    returning {
      id
      wallet_block
    }
  }
}
`
const PartnerStatus = (props) => {
  const { cardcode, status } = props
  const [updateStatusId] = useMutation(
    UPDATE_PARTNER_WALLET_STATUS_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const onChange = (checked) => {
    updateStatusId({
      variables: {
        cardcode,
        wallet_block: checked
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
        disabled={false}
      />
    </Tooltip>
  )
}

export default PartnerStatus
