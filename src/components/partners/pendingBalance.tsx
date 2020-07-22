import React from 'react'
import { Card } from 'antd'
import LabelData from '../../components/common/labelData'

const PendingBalance = (props) => {
  return (
    <Card size='small'>
      <LabelData
        info='On-going + POD trips pending balance'
        label='Active'
        value={props.active}
      />
      <LabelData
        label='OnHold'
        value={props.onhold}
      />
      <LabelData
        label='Cleared'
        value={props.cleared}
      />
    </Card>
  )
}

export default PendingBalance
