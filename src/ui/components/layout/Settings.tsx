import { Menu, Layout } from 'antd'
import Link from 'next/link'

const { Content } = Layout

export default function Settings ({ children }) {
  return (
    <Layout>
      <Menu mode='horizontal' defaultSelectedKeys={['1']}>
        <Menu.Item key='1'> <Link href='/settings'><a>City</a></Link></Menu.Item>
        <Menu.Item key='2'>  <Link href='/settings/branch'><a>Branch</a></Link></Menu.Item>
      </Menu>
      <Content>
        {children}
      </Content>
    </Layout>
  )
}
