import { Menu } from 'antd'
import {
  DashboardOutlined,
  SwapOutlined,
  CarOutlined,
  SmileOutlined,
  TeamOutlined,
  CreditCardOutlined,
  NodeIndexOutlined,
  CopyOutlined,
  LineChartOutlined,
  TransactionOutlined,
  FullscreenOutlined
} from '@ant-design/icons'
import Link from 'next/link'

const Nav = (props) => {
  return (
    <Menu theme='dark' mode={props.inline ? 'inline' : 'horizontal'} defaultSelectedKeys={['1']}>
      <Menu.Item key='1' icon={<DashboardOutlined />}>
        <Link href='/'><a>Dashboard</a></Link>
      </Menu.Item>
      <Menu.Item key='2' icon={<SwapOutlined />}>
        <Link href='/trips'><a>Trips</a></Link>
      </Menu.Item>
      <Menu.Item key='3' icon={<CarOutlined />}>
        <Link href='/trucks'><a>Trucks</a></Link>
      </Menu.Item>
      <Menu.Item key='4' icon={<SmileOutlined />}>
        <Link href='/partners'><a>Partners</a></Link>
      </Menu.Item>
      <Menu.Item key='5' icon={<TeamOutlined />}>
        <Link href='/customers'><a>Customers</a></Link>
      </Menu.Item>
      <Menu.Item key='6' icon={<CreditCardOutlined />}>
        <Link href='/cards'><a>Cards</a></Link>
      </Menu.Item>
      <Menu.Item key='7' icon={<NodeIndexOutlined />}>
        <Link href='/branches'><a>Branches</a></Link>
      </Menu.Item>
      <Menu.Item key='8' icon={<CopyOutlined />}>
        <Link href='/approvals'><a>Approvals</a></Link>
      </Menu.Item>
      <Menu.Item key='9' icon={<LineChartOutlined />}>
        <Link href='/reports'><a>Reports</a></Link>
      </Menu.Item>
      <Menu.Item key='10' icon={<TransactionOutlined />}>
        <Link href='/payables'><a>Payables</a></Link>
      </Menu.Item>
      <Menu.Item key='11' icon={<FullscreenOutlined />}>
        <Link href='/sourcing'><a>Sourcing</a></Link>
      </Menu.Item>
    </Menu>
  )
}

export default Nav
