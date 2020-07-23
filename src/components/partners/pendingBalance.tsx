import React from 'react'
import { Card } from 'antd'
import LabelData from '../../components/common/labelData'
import useShowHide from '../../hooks/useShowHide'
import OnHoldTrips from '../trips/onholdTrips'

const PendingBalance = (props) => {
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
        value={<h4 className='link u' onClick={() => onShow('onhold')}>{props.onhold || 0}</h4>}
      />
      <LabelData
        label='Cleared'
        value={props.cleared}
      />
      {visible.onhold && <OnHoldTrips visible={visible.onhold} onHide={onHide} />}
    </Card>
  )
}

export default PendingBalance
