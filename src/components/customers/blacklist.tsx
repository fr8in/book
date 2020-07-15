import { useState } from 'react'
import { Switch } from 'antd'

const Blacklist = () => {
  const [status, setStatus] = useState(false)
  const handleStatusChange = () => {
    console.log('blacklisted!')
    setStatus(prev => !prev)
  }
  return (
    <div>
      <label>Blacklisted &nbsp;</label>
      <Switch
        onChange={handleStatusChange}
        checked={status}
        className={status ? 'block' : 'unblock'}
        disabled={false}
      />
    </div>
  )
}

export default Blacklist
