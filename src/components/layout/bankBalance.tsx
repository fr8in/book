import { Menu, Checkbox, message} from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import { gql, useQuery, useMutation, useSubscription, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'
import IciciIncomingTransfer from '../../../src/components/layout/iciciIncomingTransfer'
import useShowHide from '../../../src/hooks/useShowHide'
import now from 'lodash/now'
import PrimaryBank from './primaryBank'


const BANK_BALANCE = gql`
query bank_balance${now()}{
  icici
  reliance
}`
const IC_BANK_BALANCE = gql`
query IC_bank_balance${now()}{
  icici_incoming
}`

const TRANSACTION_DOWNTIME = gql` subscription{
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
  const initial = {
    bankVisible: false
  }
  const { role } = u
  const edit_access = [role.admin]
  const access = u.is_roles(edit_access, context)


  const incoming_transfer_access = u.is_roles([role.admin, role.accounts_manager], context)

  const { onHide, onShow, visible } = useShowHide(initial)

  const [getIncomingIciciBalance, { loading: ic_loading, data: ic_data, error: ic_error }] = useLazyQuery(IC_BANK_BALANCE)

  const { loading, data, error } = useQuery(
    BANK_BALANCE, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',

    onCompleted() {
      getIncomingIciciBalance()
    },
    onError() {
      getIncomingIciciBalance()
    }
  })

  let displayData = { icici: null, yes :null, reliance: null, icici_incoming: null, downtime: { icici: null, yes:null,  reliance_fuel: null } }

  if (!loading) {
    displayData.icici = get(data, 'ICICI', null)
    displayData.yes = get(data, 'YES', null)
    displayData.reliance = get(data, 'reliance', null)
    displayData.icici_incoming = get(ic_data, 'icici_incoming', null)
  }

  const formatCurrency = (amount) => parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'INR' });

  const { loading: _loading, data: _data, error: _error } = useSubscription(
    TRANSACTION_DOWNTIME)
  if (!_loading) {
    displayData.downtime = get(_data, 'config[0].value', null)
  }

  const { icici, yes,reliance, icici_incoming, downtime } = displayData

  const [UpdateDownTime] = useMutation(
    UPDATE_DOWNTIME,
    {
      onError(error) { message.error(error.toString()) }
    }
  )

  const onChangeDownTime = (checked, type) => {
    const updated_downtime = { ...downtime }
    updated_downtime[type] = !checked
    UpdateDownTime({
      variables: {
        value: updated_downtime
      }
    })
  }


  return (
    <Menu>
      <Menu.ItemGroup key="primary_bank" title="Primary Bank">
      <Menu.Item>
        <PrimaryBank changeDownTime={onChangeDownTime}/>
        </Menu.Item>        
      </Menu.ItemGroup>
      <Menu.ItemGroup key="outgoing" title="Outgoing">
        <Menu.Item>
          <Checkbox onChange={(e) => onChangeDownTime(e.target.checked, 'ICICI')} disabled={!access} checked={!displayData.downtime.icici_bank} >ICICI <b>{icici ? formatCurrency(icici.toFixed(0)) : '₹0'}</b>   </Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox onChange={(e) => onChangeDownTime(e.target.checked, 'YES')} disabled={!access} checked={!displayData.downtime.yes_bank} >YES <b>{yes ? formatCurrency(yes.toFixed(0)) : '₹0'}</b>   </Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox onChange={(e) => onChangeDownTime(e.target.checked, 'reliance_fuel')} disabled={!access} checked={!displayData.downtime.reliance_fuel} >Reliance <b>{reliance ? formatCurrency(reliance.toFixed(0)) : '₹0'}</b> </Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>

      <Menu.ItemGroup key="incoming" title="Incoming">
        <Menu.Item onClick={incoming_transfer_access ? () => onShow('bankVisible') : () => { }}>
          <SwapOutlined />
          <label>ICICI {icici_incoming ? formatCurrency(icici_incoming.toFixed(0)) : '₹0'}</label>
        </Menu.Item>
      </Menu.ItemGroup>

      {visible.bankVisible && <IciciIncomingTransfer visible={visible.bankVisible} onHide={onHide} balance={displayData.icici_incoming} />}
    </Menu>
  )
}

export default BankBalance
