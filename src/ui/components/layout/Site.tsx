import { Layout, Menu } from 'antd'
import Link from 'next/link'

const { Content , Sider } = Layout

const Site = ({ children }) => {
  return (
    <Layout className='layout'>

      <Menu mode='horizontal' defaultSelectedKeys={['1']}>
        <Menu.Item key='1'> <Link href='/'><a>Dashboard</a></Link></Menu.Item>
        <Menu.Item key='3'>  <Link href='/partner'><a>Partner</a></Link></Menu.Item>
        <Menu.Item key='4'><Link href='/customer'><a>Customer</a></Link> </Menu.Item>
        <Menu.Item key='5'><Link href='/trip'><a>Trip</a></Link> </Menu.Item>
        <Menu.Item key='2'>  <Link href='/settings'><a>Settings</a></Link></Menu.Item>

      </Menu>
      <Content>
        {children}
      </Content>
    </Layout>
  )
}
export default Site
