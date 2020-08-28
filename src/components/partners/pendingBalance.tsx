
import { Card } from 'antd'
import LabelData from '../../components/common/labelData'
import useShowHide from '../../hooks/useShowHide'
import OnHoldTrips from '../trips/onholdTrips'

const PendingBalance = (props) => {
  const {partner_summary} = props
  const initial = { onhold: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  return (
    <Card size='small'>
      <LabelData
        info='On-going + POD trips pending balance'
        label='Active'
        value={props.active}
      />
      <LabelData
        label='OnHold'
        value={<h4 className='link u' onClick={() => onShow('onhold')}> {partner_summary.partner_accounting && partner_summary.partner_accounting.onhold || 0}</h4>}
      />
      <LabelData
        label='Cleared'
        value={partner_summary.partner_accounting && partner_summary.partner_accounting.cleared}
      />
      {visible.onhold && <OnHoldTrips visible={visible.onhold} onHide={onHide} />}
    </Card>
  )
}

export default PendingBalance
