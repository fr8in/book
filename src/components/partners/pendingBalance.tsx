import React from 'react'
import { Card, Space } from 'antd'
import {InfoCircleOutlined} from '@ant-design/icons'
import LabelData from '../../components/common/labelData'

export default function PendingBalance () {
  return (
    <div>
      <Card>
				<LabelData
          icon= {<InfoCircleOutlined />}
          label='Active'
					data={
						<Space>
							<span>0</span>
						</Space>
          }
          iconSpan={1}
          labelSpan={2}
          valueSpan={19}
					dataSpan={2}
				/>
        
					<LabelData
          label='OnHold'
					data={
						<Space>
							<span>0</span>
						</Space>
          }
          iconSpan={1}
          labelSpan={4}
          valueSpan={17}
					dataSpan={2}
				/>
     
        	<LabelData
          label='Cleared'
					data={
						<Space>
							<span>0</span>
						</Space>
          }
          iconSpan={1}
          labelSpan={4}
          valueSpan={17}
					dataSpan={2}
				/>
       
      </Card>
    </div>
  )
}

    