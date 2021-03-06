import { Button } from 'antd'
import useShowHide from '../../hooks/useShowHide'
import BookedDetail from './bookedDetail'

const WalletBalance = (props) => {
  const { wallet_balance ,cardcode} = props
  const initial = { booked: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  return (
    <span>
      <Button type='link' onClick={() => onShow('booked')} className='p0 bu'>&#8377;{wallet_balance || 0}</Button>
      {visible.booked && <BookedDetail visible={visible.booked} onHide={onHide} cardcode={cardcode}/>}
    </span>
  )
}

export default WalletBalance
