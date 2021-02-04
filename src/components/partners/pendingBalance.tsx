
import { Card } from 'antd'
import LabelData from '../../components/common/labelData'
import useShowHide from '../../hooks/useShowHide'
import OnHoldTrips from '../trips/onholdTrips'
import ClearedTrips from '../trips/clearedTrips'
import get from 'lodash/get'

const PendingBalance = (props) => {
  const { partner_summary } = props
  const initial = { onhold: false, cleared: false }
  const { visible, onShow, onHide } = useShowHide(initial)

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
        label='Invoiced'
        value={<h4 className='link u' onClick={() => onShow('cleared')}> {get(partner_summary, 'partner_accounting.cleared', null) || 0}</h4>}
      />
      {visible.onhold && <OnHoldTrips visible={visible.onhold} onHide={onHide} cardcode={partner_summary.cardcode} />}
      {visible.cleared && <ClearedTrips visible={visible.cleared} onHide={onHide} partner_id={partner_summary.id} />}
    </Card>
  )
}

export default PendingBalance
