import React from 'react'
import {Card,Space} from 'antd'
export default function PendingBalance() {
    return (
        <div>
            <Card>
              <Space direction='vertical'>
               <text>  Active</text>
                 <text>On-Hold </text>
                 <text>  Cleared</text>
              </Space>
            </Card>
            </div>
    )
}