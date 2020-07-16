import { useMutation } from '@apollo/react-hooks'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import gql from 'graphql-tag'

const UPDATE_CUSTOMER_BLACKLIST_MUTATION = gql`


mutation CustomerNameEdit($name:String,$cardCode:String) {
  update_customer(_set: {name: $name}, where: {cardCode: {_eq: $cardCode}}) {
    returning {
      id
      name
    }
  }
}
`

const CustomerName = (props) => {
  const { cardCode, name } = props

  const [updateStatusId] = useMutation(UPDATE_CUSTOMER_BLACKLIST_MUTATION)

  const onSubmit = (text, success, err) => {
    if (err) {
      message.error(err)
    } else {
      updateStatusId({
        variables: {
          cardCode,
          name: text
        },
        update (cache, data) {
          console.log('cache:', cache, 'data:', data)
          const _result = data.data.update_customer.returning[0]
          cache.writeData({ data: { [`customer:${_result.name}`]: _result } })
          message.success(success)
          localStorage.clear()
        }
      })
    }
  }

  return (
    <InlineEdit
      text={name || 'No Name'}
      onSetText={onSubmit}
      objKey='name'
    />
  )
}

export default CustomerName
