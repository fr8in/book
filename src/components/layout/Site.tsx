import { Layout, Row, Col } from 'antd'
import Link from 'next/link'
import '../../styles/site.less'
import Actions from '../common/actions'
import Nav from './nav'

const { Header, Content } = Layout

const Site = (props) => {
  return (
    <Layout id='page'>
      <Header className='siteLayout'>
        <Row>
          <Col flex='70px' className='brand'>
            <Link href='/'><a>FR<span>8</span></a></Link>
          </Col>
          <Actions />
        </Row>
        <Row justify='center'>
          <Col xs={24} sm={24} md={24}>
            <Nav />
          </Col>
        </Row>
      </Header>
      <Content className='siteBody'>
        <div className='pageCard'>
          {props.children}
        </div>
      </Content>
    </Layout>
  )
}

export default Site
