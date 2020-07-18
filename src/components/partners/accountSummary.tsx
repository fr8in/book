import React from 'react'
import { Card, Space } from 'antd'
export default function AccountSummary () {
  return (
    <div>
      <Card>
        <Space direction='vertical'>
          <p>Billing</p>
          <p>Commission </p>
        </Space>
      </Card>
    </div>
  )
}
