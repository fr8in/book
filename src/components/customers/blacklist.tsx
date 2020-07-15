import { useMutation } from '@apollo/react-hooks'
import { Switch } from 'antd'
import gql from 'graphql-tag'

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
        disabled={false}
      />
    </div>
  )
}

export default Blacklist
