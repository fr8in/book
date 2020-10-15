import { Button } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import React from 'react'
import { signInWithGoogle } from '../../lib/auth'

const Login = () => {
  return (
    <>
      <div>
        <h1>FR<span>8</span></h1>
        <p>India’s Largest Truck Brokerage Network</p>
        <Button icon={<GoogleOutlined />} onClick={signInWithGoogle}>Sign in with Google</Button>
      </div>
    </>
  )
}

export default Login
