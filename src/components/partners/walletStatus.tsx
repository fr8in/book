import { Switch, Space } from 'antd'

const PartnerStatus = () => {
  const onChange = (checked) => {
    console.log(`switch to ${checked}`)
  }
  const isBlocked = false
  return (
    <Space>
      <label>Wallet</label>
      <Switch
        onChange={onChange}
        checked={isBlocked}
        className={isBlocked ? 'block' : 'unblock'}
        disabled={false}
      />
    </Space>
  )
}

export default PartnerStatus
