import { Switch } from 'antd'

const PartnerStatus = (props) => {
  const onChange = (checked) => {
    console.log(`switch to ${checked}`)
  }
  const { status } = props
  return (
    <Switch
      onChange={onChange}
      checked={status}
      className={status ? 'block' : 'unblock'}
      disabled={false}
    />
  )
}

export default PartnerStatus
