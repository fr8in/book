import { Switch, Tooltip , message} from 'antd'
import { useMutation } from '@apollo/client'
import { UPDATE_PARTNER_WALLET_STATUS_MUTATION } from './container/query/partnerWalletStatusMutation'



  const PartnerStatus = (props) => {
    const { cardcode, status } = props
    const [updateStatusId] = useMutation(
      UPDATE_PARTNER_WALLET_STATUS_MUTATION,
      {
        onError (error) { message.error(error.toString()) }
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
    console.log('wallet_block', status)

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
