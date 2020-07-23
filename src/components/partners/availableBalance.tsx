import React from 'react'
import { Card, Button } from 'antd'
import LabelData from '../../components/common/labelData'
import WalletTopUp from '../../components/partners/walletTopup'
import useShowHide from '../../hooks/useShowHide'

const AvailableBalance = (props) => {
  const initial = { topUp: false}
  const { visible, onShow,onHide } = useShowHide(initial)
  return (
    <Card size='small'>
      <LabelData
        label='Wallet'
        value={<h4 className='link u'>{props.wallet || 0}</h4>}
        modelTrigger={<Button type='primary' size='small'  onClick={() => onShow('topUp')}>Top Up</Button>}
      />
      <LabelData
        label='Fuel Card'
        value={props.fuel}
      />
      <LabelData
        label='FasTag'
        value={props.fasTag}
      />
       {visible.topUp && <WalletTopUp visible={visible.topUp} onHide={() => onHide('topUp')} />}
    </Card>
  )
}

export default AvailableBalance
