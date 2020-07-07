import React from 'react'
import App from 'next/app'

import 'antd/dist/antd.less'

import SiteLayout from '../ui/components/layout/Site'
import SettingsLayout from '../ui/components/layout/Settings'

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
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    )
  }
}

export default MyApp
