import { Menu } from 'antd'
import {
  DashboardOutlined,
  SwapOutlined,
  CarOutlined,
  SmileOutlined,
  TeamOutlined,
  NodeIndexOutlined,
  CopyOutlined,
  LineChartOutlined,
  TransactionOutlined,
  FullscreenOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import router from 'next/router'

const Nav = (props) => {
  const path = router.pathname !== '/' ? router.pathname.split('/')[1] : 'dashboard'

  return (
    <Menu theme='dark' mode={props.inline ? 'inline' : 'horizontal'} defaultSelectedKeys={[path]}>
      <Menu.Item key='dashboard'>
        <Link href='/'><a><DashboardOutlined /><span className='menu-label'>Dashboard</span></a></Link>
      </Menu.Item>
      <Menu.Item key='trips'>
        <Link href='/trips'><a><SwapOutlined /><span className='menu-label'>Trips</span></a></Link>
      </Menu.Item>
      <Menu.Item key='trucks'>
        <Link href='/trucks'><a><CarOutlined /><span className='menu-label'>Trucks</span></a></Link>
      </Menu.Item>
      <Menu.Item key='partners'>
        <Link href='/partners'><a><SmileOutlined /><span className='menu-label'>Partners</span></a></Link>
      </Menu.Item>
      <Menu.Item key='customers'>
        <Link href='/customers'><a><TeamOutlined /><span className='menu-label'>Customers</span></a></Link>
      </Menu.Item>
      <Menu.Item key='branches'>
        <Link href='/branches'><a><NodeIndexOutlined /><span className='menu-label'>Branches</span></a></Link>
      </Menu.Item>
      <Menu.Item key='approvals'>
        <Link href='/approvals'><a><CopyOutlined /><span className='menu-label'>Approvals</span></a></Link>
      </Menu.Item>
      <Menu.Item key='reports'>
        <Link href='/reports'><a><LineChartOutlined /><span className='menu-label'>Reports</span></a></Link>
      </Menu.Item>
      <Menu.Item key='payables'>
        <Link href='/payables'><a><TransactionOutlined /><span className='menu-label'>Payables</span></a></Link>
      </Menu.Item>
      <Menu.Item key='sourcing'>
        <Link href='/sourcing'><a><FullscreenOutlined /><span className='menu-label'>Sourcing</span></a></Link>
      </Menu.Item>
    </Menu>
  )
}

export default Nav
