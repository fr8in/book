import { Card } from 'antd'
import LabelData from '../../components/common/labelData'

const AccountSummary = (props) => {
  return (
    <Card size='small'>
      <LabelData
        info='Billed value = billed + commission'
        label='Billed'
        count={props.billedCount}
        value={props.value}
      />
      <LabelData
        label='Commission'
        count={props.commmission}
        value={props.value}
      />
    </Card>
  )
}

export default AccountSummary
