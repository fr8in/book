import { Select, message } from 'antd'
import { CloseCircleTwoTone, EditTwoTone } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client'
import { CUSTOMERS_TYPE_QUERY } from './containers/query/customersTypeQuery'
import { UPDATE_CUSTOMER_TYPE_MUTATION } from './containers/query/updateCustomerTypeMutation'
import useShowHide from '../../hooks/useShowHide'

const CustomerType = (props) => {
  const { type, cardcode } = props

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const { loading, error, data } = useQuery(
    CUSTOMERS_TYPE_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )

  const [updateCustomerTypeId] = useMutation(
    UPDATE_CUSTOMER_TYPE_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  if (loading) return null
  console.log('CustomerType error', error)

  const { customer_type } = data
  const typeList = customer_type.map(data => {
    return { value: data.value, label: data.comment }
  })

  const handleChange = (value) => {
    console.log(`selected ${value}`)
    updateCustomerTypeId({
      variables: {
        cardcode,
        type_id: value
      }
    })
    onHide()
  }

  return (
    <div>
      {!visible.selectType ? (
        <label>
          {type}{' '}
          <EditTwoTone onClick={() => onShow('selectType')} />
        </label>)
        : (
          <span>
            <Select
              size='small'
              style={{ width: 110 }}
              placeholder='Select Type'
              options={typeList}
              value={type}
              onChange={handleChange}
            />{' '}
            <CloseCircleTwoTone onClick={onHide} />
          </span>)}
    </div>
  )
}

export default CustomerType
