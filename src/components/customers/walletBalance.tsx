import { Space, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

const WalletBalance = (props) => {
  const onRefresh = () => {
    console.log('data refreshed!')
  }
  return (
    <Space>
      <h3 className='m0'>Wallet: {1250}</h3>
      <Button type='primary' size='small' shape='circle' icon={<ReloadOutlined />} onClick={onRefresh} />
    </Space>
  )
}

export default WalletBalance
