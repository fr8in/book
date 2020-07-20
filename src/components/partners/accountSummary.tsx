import React from 'react'
import { Card, Space } from 'antd'
import LabelData from '../../components/common/labelData'
import {InfoCircleOutlined} from '@ant-design/icons'
export default function AccountSummary () {
  return (
    <div>
      <Card>
				<LabelData
          icon= {<InfoCircleOutlined />}
          label='Billed'
          value='(0)'
					data={
						<Space>
							<span>0</span>
						</Space>
          }
         labelSpan={2}
         valueSpan={19}
				/>
      
					<LabelData
          label='Commission'
          value='(0)'
					data={
						<Space>
							<span>0</span>
						</Space>
          }
          labelSpan={4}
          
				/>
       
      </Card>
    </div>
  )
}
