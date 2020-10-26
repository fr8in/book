import { Menu } from 'antd'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const BANK_BALANCE = gql`
query bank_balance{
  icici
  yes_bank
  reliance
}`

const BankBalance = () => {
  const { loading, data, error } = useQuery(
    BANK_BALANCE, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('BankBalance Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const icici = get(_data, 'icici', null)
  const yes_bank = get(_data, 'yes_bank', null)
  const reliance = get(_data, 'reliance', null)
  return (
    <Menu>
      <Menu.Item key='0'>ICICI <b>₹{icici ? icici.toFixed(2) : null}</b></Menu.Item>
      <Menu.Item key='1'>YesBank <b>₹{yes_bank ? yes_bank.toFixed(2) : null}</b></Menu.Item>
      <Menu.Item key='2'>Reliance <b>₹{reliance ? reliance.toFixed(2) : null}</b></Menu.Item>
    </Menu>
  )
}

export default BankBalance
