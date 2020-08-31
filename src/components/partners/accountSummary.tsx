import { Card } from 'antd'
import LabelData from '../../components/common/labelData'

const AccountSummary = (props) => {
  const { partner_summary } = props

  console.log('props', props)

  return (
    <Card size='small'>
      <LabelData
        info='Billed value = billed + commission'
        label='Billed'
        count={props.billedCount}
        value={partner_summary.partner_accounting && partner_summary.partner_accounting.billed}

      />
      <LabelData
        label='Commission'
        count={props.commmission}
        value={partner_summary.partner_accounting && partner_summary.partner_accounting.commission}
      />
    </Card>
  )
}

export default AccountSummary
