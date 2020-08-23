
import Head from 'next/head'
import { cloneElement, useState } from 'react'
import { Layout, Row, Col } from 'antd'
import Link from 'next/link'
import '../../styles/site.less'
import Actions from './actions'
import Nav from './nav'
import { gql, useQuery } from '@apollo/client'
import { DatabaseTwoTone } from '@ant-design/icons'

const { Header, Content } = Layout

const SSH_ACCESS = gql`
query ssh_access($email:String!){
  isTechUser(email: $email)
}
`

const PageLayout = (props) => {
  const initialFilter = {
    now: new Date().toISOString(),
    regions: null,
    branches: null,
    cities: null,
    managers: null,
    types: null
  }
  const [filters, setFilters] = useState(initialFilter)

  const { loading, error, data } = useQuery(
    SSH_ACCESS,
    {
      variables: { email: 'jay@fr8.in' },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network'
    }
  )

  if (loading) return null
  const { isTechUser } = data
  
  return (
    <Layout id='page'>
      <Header className='siteLayout'>
        <Row>
          <Col flex='70px' className='brand'>
            <Link href='/'><a>FR<span>8</span></a></Link>
          </Col>
          <Actions onFilter={setFilters} initialFilter isTechUser={isTechUser} />
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
            <link rel='icon' href='/favicon.ico' type='image/x-icon' />
            <meta charSet='utf-8' />
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          </Head>
          <div className='pageBox'>
            {cloneElement(props.children, { filters })}
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default PageLayout
