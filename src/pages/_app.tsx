import React from 'react'
import App from 'next/app'
import 'antd/dist/antd.less'
import '../styles/global.less'

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
     
        <Component {...pageProps}  />
    )
  }
}

export default withApollo({ ssr: true })(MyApp)
