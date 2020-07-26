import { Switch, Space } from 'antd'

const PartnerStatus = (props) => {
  const onChange = (checked) => {
    console.log(`switch to ${checked}`)
  }
  const {status} = props
  return (
    <Space>
      <label>Wallet</label>
      <Switch
        onChange={onChange}
        checked={status}
        className={status ? 'block' : 'unblock'}
        disabled={false}
      />
    </Space>
  )
}

export default PartnerStatus
