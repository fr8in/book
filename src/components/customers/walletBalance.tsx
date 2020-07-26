import { Button } from 'antd'
import useShowHide from '../../hooks/useShowHide'
import BookedDetail from './bookedDetail'

const WalletBalance = (props) => {
  const initial = { booked: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  return (
    <span className='u'>
      <Button type='link' onClick={() => onShow('booked')} className='p0 bu'>&#8377;{1250}</Button>
      {visible.booked && <BookedDetail visible={visible.booked} onHide={onHide} />}
    </span>
  )
}

export default WalletBalance
