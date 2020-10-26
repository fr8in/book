
import { Card } from 'antd'
import LabelData from '../../components/common/labelData'
import useShowHide from '../../hooks/useShowHide'
import OnHoldTrips from '../trips/onholdTrips'
import get from 'lodash/get'

const PendingBalance = (props) => {
  const {partner_summary} = props
  const initial = { onhold: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  console.log('partner_summary', partner_summary)
  return (
    <Card size='small'>
      <LabelData
        info='On-going + POD trips pending balance'
        label='Active'
        value={get(partner_summary, 'partner_active.amount', null) || 0}
      />
      <LabelData
        label='OnHold'
        value={<h4 className='link u' onClick={() => onShow('onhold')}> {get(partner_summary, 'partner_accounting.onhold', null) || 0}</h4>}
      />
      <LabelData
        label='Cleared'
        value={get(partner_summary, 'partner_accounting.cleared', null) || 0}
      />
      {visible.onhold && <OnHoldTrips visible={visible.onhold} onHide={onHide} cardcode={partner_summary.cardcode}/>}
    </Card>
  )
}

export default PendingBalance
