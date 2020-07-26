import { Switch, Tooltip } from 'antd'

const PartnerStatus = (props) => {
  const onChange = (checked) => {
    console.log(`switch to ${checked}`)
  }
  const { status } = props
  return (
    <Tooltip title={status ? 'Unblock Wallet' : 'Block Wallet'}>
      <Switch
        onChange={onChange}
        checked={status}
        className={status ? 'block' : 'unblock'}
        disabled={false}
      />
    </Tooltip>
  )
}

export default PartnerStatus
