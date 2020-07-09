import React from 'react'
import App from 'next/app'
import '../styles/global.less'
import 'antd/dist/antd.less'

import SiteLayout from '../components/layout/Site'
import SettingsLayout from '../components/layout/Settings'

class MyApp extends App {
  render () {
    const { Component, pageProps, router } = this.props

    if (router.pathname.startsWith('/settings')) {
      return (
        <SiteLayout>
          <SettingsLayout>
            <Component {...pageProps} />
          </SettingsLayout>
        </SiteLayout>
      )
    }

    return (
      <SiteLayout fixed collapsible collapseHandle collapsed>
        <Component {...pageProps} />
      </SiteLayout>
    )
  }
}

export default MyApp
