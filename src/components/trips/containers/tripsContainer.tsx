import { useState } from 'react'
import { Card, Tabs, Space, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import Trips from '../trips'
import TitleWithCount from '../../common/titleWithCount'

const { TabPane } = Tabs

const TripsContainer = () => {
  const [tabKey, setTabKey] = useState('1')
  const onTabChange = (key) => {
    console.log('key', key)
    setTabKey(key)
  }
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        defaultActiveKey='1'
        onChange={onTabChange}
        tabBarExtraContent={
          <span>
            {tabKey === '2' &&
              <Space>
                <Button shape='circle' icon={<DownloadOutlined />} />
                <Button type='primary'>POD Receipt</Button>
              </Space>}
            {tabKey === '4' &&
              <Space>
                <Button type='primary'>POD Dispatch</Button>
              </Space>}
          </span>
        }
      >
        <TabPane tab={<TitleWithCount name='Trips' />} key='1'>
          <Trips />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Delivered' value={1840} />} key='2'>
          <Trips />
        </TabPane>
        <TabPane tab={<TitleWithCount name='POD Verified' value={42} />} key='3'>
          <Trips />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Invoiced' value={451} />} key='4'>
          <Trips />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default TripsContainer
