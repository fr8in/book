import React, { useState } from 'react'
import { Layout, Menu, Row, Col, Card } from 'antd'
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
import useWindowSize from '../customHooks/useWindowSize'

const { Header, Footer, Sider, Content } = Layout

const Site = (props) => {
  const initial = props.collapsed
  const [menuCollapse, setMenuCollapse] = useState(initial)
  const size = useWindowSize()

  const onCollapse = () => {
    if (collapseHandle) {
      return setMenuCollapse(!menuCollapse)
    }
  }
  const { fixed, collapsed, collapsible, collapseHandle } = props
  return (
    <>
      <Layout id='page' className={`${fixed ? 'asideFixed' : ''}`}>
        <Sider
          defaultCollapsed={collapsed}
          collapsible={collapsible}
          onCollapse={onCollapse}
          collapsedWidth={size.width <= 640 ? 0 : collapsed ? 80 : 200}
          theme='dark'
        >
          <div className='brand'>FR<span>8</span></div>
          <div className='scrollFix'>
            <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
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
                <Link href='/cards'><a>Cads</a></Link>
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
          </div>
        </Sider>
        <Layout className={`${menuCollapse ? 'closeMenu' : 'openMenu'} ${fixed ? 'clearTop' : ''}`}>
          <Header className='header'>
            <Row justify='space-between'>
              <Col sm={4} />
              <Col sm={12} style={{ textAlign: 'right' }}>
                {/* <Button onClick={toggleTheme} type={darkTheme ? 'default' : 'primary'} shape='circle' icon={<HeartOutlined />} /> */}
              </Col>
            </Row>
          </Header>
          <Content>
            <Card size='small' className='pageCard'>
              {props.children}
            </Card>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}
export default Site
