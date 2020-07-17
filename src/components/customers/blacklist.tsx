import { useMutation } from '@apollo/client'
import { Switch, Space } from 'antd'
import { gql } from '@apollo/client'

// This has to go to global
const customerStatus = {
  Blacklisted: 6,
  Active: 1
}
const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`


mutation customerBlacklist($statusId:Int,$cardCode:String) {
  update_customer(_set: {statusId: $statusId}, where: {cardCode: {_eq: $cardCode}}) {
    returning {
      id
      statusId
    }
  }
}
`

const Blacklist = ({ cardCode, statusId }) => {
  const [updateStatusId] = useMutation(UPDATE_CUSTOMER_BLACKLIST_MUTATION)
  const onChange = (checked: Boolean) => {
    updateStatusId({
      variables: {
        cardCode,
        statusId: checked ? customerStatus.Blacklisted : customerStatus.Active,
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
