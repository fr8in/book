import React from 'react'
import App from 'next/app'
import 'antd/dist/antd.less'
import '../styles/global.less'

// import AdminLayout from '../components/layout/Admin'
import SiteLayout from '../components/layout/Site'
import LoginLayout from '../components/layout/loginLayout'
import { withApollo } from '../lib/apollo'

class MyApp extends App {
  render () {
    const { Component, pageProps, router } = this.props

    if (router.pathname.startsWith('/login')) {
      return (
        <LoginLayout>
          <Component {...pageProps} />
        </LoginLayout>
      )
    }

    return (
      <SiteLayout fixed collapsible collapseHandle collapsed>
        <Component {...pageProps} />
      </SiteLayout>
    )
  }
}

export default withApollo({ ssr: true })(MyApp)
