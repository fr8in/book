import { useMutation } from '@apollo/client'
import { Switch, Space } from 'antd'
import { UPDATE_CUSTOMER_BLACKLIST_MUTATION } from './containers/query/updateCustomerBlacklistMutation'

// This has to go to global
const customerStatus = {
  Blacklisted: 6,
  Active: 1
}

const Blacklist = ({ cardcode, statusId }) => {
  const [updateStatusId] = useMutation(UPDATE_CUSTOMER_BLACKLIST_MUTATION)

  const onChange = (checked) => {
    updateStatusId({
      variables: {
        cardcode,
        statusId: checked ? customerStatus.Blacklisted : customerStatus.Active
      }
    })
  }

  const blacklisted = statusId === customerStatus.Blacklisted

  return (
    <Space>
      <label>Blacklisted</label>
      <Switch
        onChange={onChange}
        checked={blacklisted}
        className={blacklisted ? 'block' : 'unblock'}
        disabled={false}
      />
    </Space>
  )
}

export default Blacklist
