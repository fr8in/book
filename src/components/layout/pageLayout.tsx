
import { cloneElement, useState } from 'react'
import Head from 'next/head'
import { Layout, Row, Col } from 'antd'
import Link from 'next/link'
import '../../styles/site.less'
import Actions from './actions'
import Nav from './nav'
import Router from 'next/router'
import Loading from '../../components/common/loading'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'

const { Header, Content } = Layout

const PageLayout = (props) => {
  if (props.authState.status === 'out') {
    Router.push('/login')
    return <Loading preloading />
  } else if (props.authState.status !== 'in') {
    return <Loading preloading />
  }
  const initialFilter = {
    now: new Date().toISOString(),
    regions: null,
    branches: null,
    cities: null,
    managers: null,
    types: null
  }
  const [filters, setFilters] = useState(initialFilter)
  const email = get(props, 'authState.user.email', null)
  const roles = get(props, 'authState.roles', null)
  const user = { email, roles }

  return (
    <userContext.Provider value={user}>
      <Layout id='page'>
        <Header className='siteLayout'>
          <Row>
            <Col flex='70px' className='brand'>
              <Link href='/'><a>FR<span>8</span></a></Link>
            </Col>
            <Actions onFilter={setFilters} initialFilter />
          </Row>
          <Row justify='center'>
            <Col xs={24} sm={24} md={24}>
              <Nav />
            </Col>
          </Row>
        </Header>
        <Content className='siteBody'>
          <div className='pageCard'>
            <Head>
              <title>{props.title ? 'FR8 - ' + props.title : 'FR8 - Track'}</title>
              <link rel='icon' type='image/x-icon' href='/images/favicon.ico' />
              <meta charSet='utf-8' />
              <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            </Head>
            <div className='pageBox'>
              {cloneElement(props.children, { filters })}
            </div>
          </div>
        </Content>
      </Layout>
    </userContext.Provider>
  )
}

export default PageLayout
