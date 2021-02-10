
import { cloneElement, useContext, useEffect } from 'react'
import Head from 'next/head'
import { Layout, Row, Col } from 'antd'
import Link from 'next/link'
import '../../styles/site.less'
import Actions from './actions'
import Nav from './nav'
import Router from 'next/router'
import Loading from '../../components/common/loading'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'
import AppState from '../../context/appState'

const EMPLOYEE_QUERY = gql`
query employee_name($email:String){
  employee (where:{email:{_eq:$email}}){
    id
    name
    branch_employees{
      branch_id
    }
  }
}`

const { Header, Content } = Layout

const PageLayout = (props) => {
  if (props.authState.status === 'out') {
    Router.push('/login')
    return <Loading preloading />
  } else if (props.authState.status !== 'in') {
    return <Loading preloading />
  }
 
  const email = get(props, 'authState.user.email', null)
  const roles = get(props, 'authState.roles', null)
  

  const { loading, data, error } = useQuery(
    EMPLOYEE_QUERY,
    {
      variables: { email: email },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const employees = get(_data, 'employee[0].branch_employees', [])
  const employee_id = get(_data, 'employee[0].id', null)
  const branch_ids = employees.map(employee => employee.branch_id)

  

  const user = { email, roles, employee_id }
  return (
      <AppState user={user} >
      <Layout id='page'>
        <Header className='siteLayout'>
          <Row>
            <Col flex='70px' className='brand'>
              <Link href='/'><a>FR<span>8</span></a></Link>
            </Col>
            <Actions   branch_ids={branch_ids}/>
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
              <link rel='icon' type='image/x-icon' href='https://www.fr8.in/images/favicon.ico' />
              <meta charSet='utf-8' />
              <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            </Head>
            <div className='pageBox'>
              {cloneElement(props.children)}
            </div>
          </div>
        </Content>
      </Layout>
      </AppState>
  )
}

export default PageLayout
