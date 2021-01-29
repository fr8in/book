import { Menu, Checkbox, message} from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { useContext, useState } from 'react'
import { gql, useQuery, useMutation, useSubscription} from '@apollo/client'
import get from 'lodash/get'
import u from '../../lib/util'
import userContext from '../../lib/userContaxt'
import IciciIncomingTransfer from '../../../src/components/layout/iciciIncomingTransfer'
import useShowHide from '../../../src/hooks/useShowHide'

const BANK_BALANCE = gql`
query bank_balance{
  icici
  reliance
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
  const initial={
    bankVisible:false
  }
  const { role } = u
  const edit_access = [role.admin]
  const access = u.is_roles(edit_access, context)
  const {onHide,onShow,visible}=useShowHide(initial)

  const { loading, data, error } = useQuery(
    BANK_BALANCE, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all'
  }
  )

  let displayData = { icici: null, reliance: null, icici_incoming : null,downtime: {icici_bank:null,reliance_fuel:null} }
  if (!loading) {
    displayData.icici = get(data, 'icici', null)
    displayData.reliance = get(data, 'reliance', null)
    displayData.icici_incoming = get(data, 'icici_incoming', null)

  }
  const { loading: _loading, data: _data, error: _error } = useSubscription(
    TRANSACTION_DOWNTIME)
  if (!_loading) {
    displayData.downtime = get(_data, 'config[0].value', null)
  }

  const { icici, reliance, icici_incoming ,downtime } = displayData

  const [UpdateDownTime] = useMutation(
    UPDATE_DOWNTIME,
    {
      onError(error) { message.error(error.toString()) }
    }
  )

  const onChangeDownTime = (e, type) => {
    const updated_downtime = { ...downtime }
    updated_downtime[type] = !e.target.checked
    UpdateDownTime({
      variables: {
        value: updated_downtime
      }
    })
  }
  const onTransferClick = () => {
   console.log("transfer clicked - - - ") 
   onShow({visible:true}) 
  }
  
  console.log("visible",visible)

  return (
          <Menu>
            <Menu.Item>
              <Checkbox onChange={(e) => onChangeDownTime(e, 'icici_bank')} disabled={!access} checked={!displayData.downtime.icici_bank} >ICICI <b>₹{icici ? icici.toFixed(0) : 0}</b>   </Checkbox>
            </Menu.Item>
            <Menu.Item>
              <Checkbox onChange={(e) => onChangeDownTime(e, 'reliance_fuel')} disabled={!access} checked={!displayData.downtime.reliance_fuel} >Reliance <b>₹{reliance ? reliance.toFixed(0) : 0}</b> </Checkbox>
            </Menu.Item>
            <Menu.Item>
            <SwapOutlined onClick={() =>onShow('bankVisible')} /> ICICI INCOMING <b>₹{icici_incoming ? icici_incoming.toFixed(0) : 0}</b>   
            </Menu.Item>
            {visible.bankVisible && <IciciIncomingTransfer visible={visible.bankVisible} onHide = { onHide}/>}
          </Menu>
  )
}

export default BankBalance
