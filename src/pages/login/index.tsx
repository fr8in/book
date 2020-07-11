import { Button } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import Router from 'next/router'

const Login = () => {
  const loginHandler = (e) => {
    e.preventDefault()
    Router.push('/')
  }
  return (
    <div>
      <h1>FR<span>8</span></h1>
      <p>India’s Largest Truck Brokerage Network</p>
      <Button icon={<GoogleOutlined />} onClick={loginHandler}>Sign in with Google</Button>
    </div>
  )
}

export default Login
