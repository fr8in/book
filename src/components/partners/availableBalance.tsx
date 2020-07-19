import React from 'react'
import { Card, Space } from 'antd'
export default function AvailableBalance () {
  return (
    <div>
      <Card>
        <Space direction='vertical'>
          <p>Wallet</p>
          <p>Fuel-Card </p>
          <p>FasTag</p>
        </Space>
      </Card>
    </div>
  )
}
