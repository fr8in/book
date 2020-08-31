import { Card } from 'antd'
import LabelData from '../../components/common/labelData'

const AvailableBalance = (props) => {
  const { partner_summary } = props

  return (
    <Card size='small'>
      <LabelData label='Wallet' value={partner_summary.partner_accounting && partner_summary.partner_accounting.wallet_balance || 0} />
      <LabelData label='Fuel Card' value={props.fuel} />
      <LabelData label='FasTag' value={props.fasTag} />
    </Card>
  )
}

export default AvailableBalance
