import { useMutation } from '@apollo/client'
import { Switch } from 'antd'
import { gql } from '@apollo/client'

// This has to go to global
const customerStatus = {
  Blacklisted: 6,
  Active: 1
}
const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`
mutation customerBlacklist($statusId:Int,$cardcode:String) {
  update_customer(_set: {statusId: $statusId}, where: {cardcode: {_eq: $cardcode}}) {
    returning {
      id
      statusId
    }
  }
}
`

const Blacklist = ({ cardcode, statusId, disabled = true }) => {
  const [updateStatusId] = useMutation(UPDATE_CUSTOMER_BLACKLIST_MUTATION)
  const onChange = (checked: Boolean) => {
    updateStatusId({
      variables: {
        cardcode,
        statusId: checked ? customerStatus.Blacklisted : customerStatus.Active,
      },
      update(cache, data) {
        //console.log('cache:', cache, 'data: ', ç)
        const _result = data.data.update_customer.returning[0]
        cache.writeData({ data: { [`customer:${_result.id}`]: _result } })
        localStorage.clear()
      }

    })
  }
  const checked = statusId === customerStatus.Blacklisted
  return (

    <div>
      <label>Blacklisted &nbsp;</label>
      <Switch
        onChange={onChange}
        checked={checked}
        className={checked ? 'block' : 'unblock'}
        disabled={disabled}
      />
    </div>
  )
}

export default Blacklist
