import { useMutation } from '@apollo/client'
import { Switch, Tooltip,message } from 'antd'
import { UPDATE_CUSTOMER_BLACKLIST_MUTATION } from './containers/query/updateCustomerBlacklistMutation'

// This has to go to global
const customerStatus = {
  Blacklisted: 6,
  Active: 1
}

const Blacklist = ({ cardcode, statusId }) => {
  const [updateStatusId ,{ loading, error },] = useMutation(UPDATE_CUSTOMER_BLACKLIST_MUTATION)

  const onChange = (checked) => {
    updateStatusId({
      variables: {
        cardcode,
        status_id: checked ? customerStatus.Blacklisted : customerStatus.Active
      }
    })
  }

  const blacklisted = statusId === customerStatus.Blacklisted
  console.log('blacklist', statusId, blacklisted)
  return (
<div> 
    <Tooltip title={blacklisted ? 'Unblacklist' : 'Blacklist'}>
      <Switch
        onChange={onChange}
        checked={blacklisted}
        className={blacklisted ? 'block' : 'unblock'}
        disabled={false}
      />
    </Tooltip>

 {error && message.error(error, 2)}
</div>
  )
}

export default Blacklist
