import { Card } from 'antd'
import LabelData from '../../components/common/labelData'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'

const FUEL_FASTAG_BALANCE_QUERY = gql`
query fuel_fastag_balance($cardcode: String!) {
  partner(where: {cardcode: {_eq: $cardcode}}) {
    id
    fuel_balance
    fastag_balance
  }
}`

const AvailableBalance = (props) => {
  const { partner_summary } = props
  console.log('partner_summary', partner_summary)
  const { loading, error, data } = useQuery(
    FUEL_FASTAG_BALANCE_QUERY,
    {
      variables: { cardcode: partner_summary.cardcode },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('AvailableBalance error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const balance = get(_data, 'partner[0]', null)

  return (
    <Card size='small'>
      <LabelData label='Wallet' value={get(partner_summary, 'partner_accounting.wallet_balance', null) || 0} />
      <LabelData label='Fuel Card' value={get(balance, 'fuel_balance', 0)} />
      <LabelData label='FasTag' value={get(balance, 'fastag_balance', 0)} />
    </Card>
  )
}

export default AvailableBalance
