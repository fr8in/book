import React from 'react'
import App from 'next/app'
import 'antd/dist/antd.less'
import '../styles/global.less'

import AdminLayout from '../components/layout/Admin'
import SiteLayout from '../components/layout/Site'
import SettingsLayout from '../components/layout/Settings'

class MyApp extends App {
  render () {
    const { Component, pageProps, router } = this.props

    if (router.pathname.startsWith('/login')) {
      return (
        <AdminLayout>
          <SettingsLayout>
            <Component {...pageProps} />
          </SettingsLayout>
        </AdminLayout>
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
