import { useState } from 'react'
import { Layout, Row, Col } from 'antd'
import useWindowSize from '../../hooks/useWindowSize'
import '../../styles/admin.less'
import Actions from '../common/actions'
import Nav from './nav'
import Link from 'next/link'

const { Header, Sider, Content } = Layout

const Admin = (props) => {
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
          <div className='brand'>
            <Link href='/'><a>FR<span>8</span></a></Link>
          </div>
          <div className='scrollFix'>
            <Nav inline />
          </div>
        </Sider>
        <Layout className={`${menuCollapse ? 'closeMenu' : 'openMenu'} ${fixed ? 'clearTop' : ''}`}>
          <Header className='header'>
            <Row justify='space-between'>
              <Col flex='60px' />
              <Actions />
            </Row>
          </Header>
          <Content>
            <div className='pageCard'>
              {props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}
export default Admin
