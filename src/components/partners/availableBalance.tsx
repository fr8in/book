import React from 'react'
import { Card, Button } from 'antd'
import LabelData from '../../components/common/labelData'

const AvailableBalance = (props) => {
  return (
    <Card size='small'>
      <LabelData
        label='Wallet'
        value={<h4 className='link u'>{props.wallet || 0}</h4>}
        modelTrigger={<Button type='primary' size='small'>Top Up</Button>}
      />
      <LabelData
        label='Fuel Card'
        value={props.fuel}
      />
      <LabelData
        label='FasTag'
        value={props.fasTag}
      />
    </Card>
  )
}

export default AvailableBalance
