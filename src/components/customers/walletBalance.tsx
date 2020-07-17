import { Space, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import BookedDetail from './bookedDetail'

const WalletBalance = (props) => {
  const initial = { booked: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const onRefresh = () => {
    console.log('data refreshed!')
  }
  return (
    <Space>
      <h3 className='m0'>Wallet:&nbsp;
        <Button type='link' onClick={() => onShow('booked')} className='p0 bu'>{1250}</Button>
      </h3>
      <Button size='small' shape='circle' icon={<ReloadOutlined />} onClick={onRefresh} />
      {visible.booked && <BookedDetail visible={visible.booked} onHide={() => onHide('booked')} />}
    </Space>
  )
}

export default WalletBalance
