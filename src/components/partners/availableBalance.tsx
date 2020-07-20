import React from 'react'
import { Card, Space } from 'antd'
import LabelData from '../../components/common/labelData'
export default function AvailableBalance () {
  return (
    <div>
      <Card>
      <LabelData
          label='Wallet'
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
          label='Fuel Card'
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
          label='Fas Tag'
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
