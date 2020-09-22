import React, { useState, useEffect } from 'react'
// import App from 'next/app'
import 'antd/dist/antd.less'
import '../styles/global.less'

import LoginLayout from '../components/layout/loginLayout'
import { withApollo } from '../lib/apollo'

import { auth } from '../lib/auth'

const MyApp = (props) => {
  const [authState, setAuthState] = useState({ status: 'loading' })
  useEffect(() => {
    return auth(setAuthState)
  }, [])
  const { Component, pageProps, router } = props
  if (router.pathname.startsWith('/login')) {
    return (
      <LoginLayout authState={authState}>
        <Component {...pageProps} />
      </LoginLayout>
    )
  }

  return (
    <Component {...pageProps} authState={authState} />
  )
}

export default withApollo({ ssr: true })(MyApp)
