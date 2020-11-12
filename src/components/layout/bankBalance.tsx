import { Menu, Checkbox, message} from 'antd'
import { useContext } from 'react'
import { gql, useQuery, useMutation} from '@apollo/client'
import get from 'lodash/get'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'

const BANK_BALANCE = gql`
query bank_balance{
  icici
  reliance
}`

const TRANSACTION_DOWNTIME = gql` query{
  config(where: {key: {_eq: "transaction_downtime"}}){
    value
  }
}`

const UPDATE_DOWNTIME = gql`
mutation UpdateDowntime($value:jsonb) {
  update_config(where: {key: {_eq: "transaction_downtime"}}, _set: {key: "transaction_downtime", value:$value}) {
    returning {
      value
    }
  }
}`

const BankBalance = () => {

  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin]
  const access = u.is_roles(edit_access, context)

  const { loading, data, error } = useQuery(
    BANK_BALANCE, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all'
  }
  )

  let displayData = { icici: null, reliance: null, downtime: null }
  if (!loading) {
    displayData.icici = get(data, 'icici', null)
    displayData.reliance = get(data, 'reliance', null)

  }
  const { loading: _loading, data: _data, error: _error } = useQuery(
    TRANSACTION_DOWNTIME, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  })
  if (!_loading) {
    displayData.downtime = get(_data, 'config[0].value', null)
  }

  const { icici, reliance, downtime } = displayData

  const [UpdateDownTime] = useMutation(
    UPDATE_DOWNTIME,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const onChangeDownTime = (e, type) => {
    const updated_downtime = { ...downtime }
    updated_downtime[type] = e.target.checked
    UpdateDownTime({
      variables: {
        value: updated_downtime
      }
    })
  }
  return (
    <span>
      { access ||
        <span>
          <Menu>
            <Menu.Item>
              <Checkbox onChange={(e) => onChangeDownTime(e, 'icici_bank')}  >ICICI <b>₹{icici ? icici.toFixed(2) : 0}</b>   </Checkbox>
            </Menu.Item>
            <Menu.Item>
              <Checkbox onChange={(e) => onChangeDownTime(e, 'reliance_fuel')}  >Reliance <b>₹{reliance ? reliance.toFixed(2) : 0}</b> </Checkbox>
            </Menu.Item>
          </Menu>
        </span>
      }
    </span>
  )
}

export default BankBalance
