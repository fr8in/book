import { useMutation } from '@apollo/client'
import { message } from 'antd'
import InlineEdit from '../common/inlineEdit'
import { gql } from '@apollo/client'

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
        }
      })
      message.success(success)
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
