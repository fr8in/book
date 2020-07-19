import React from 'react'
import { Card, Space } from 'antd'
export default function PendingBalance () {
  return (
    <div>
      <Card>
        <Space direction='vertical'>
          <p>Active</p>
          <p>On-Hold </p>
          <p>Cleared</p>
        </Space>
      </Card>
    </div>
  )
}
