import { useState } from 'react'
import { Card, Tabs, Space, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import Trips from '../trips'
import TitleWithCount from '../../common/titleWithCount'

import { useQuery } from '@apollo/client'
import { TRIPS_QUERY } from './query/tripsQuery'
import Loading from '../../common/loading'

const { TabPane } = Tabs

export const tripsQueryVars = {
  offset: 0,
  limit: 10
}

const TripsContainer = () => {
  const { loading, error, data } = useQuery(
    TRIPS_QUERY,
    {
      variables: tripsQueryVars,
      notifyOnNetworkStatusChange: true
    }
  )
  const [tabKey, setTabKey] = useState('1')
  const onTabChange = (key) => {
    console.log('key', key)
    setTabKey(key)
  }

  if (loading) return <Loading />
  console.log('TripsContainer error', error)

  const { trip } = data

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
          <Trips trips={trip} tripsTable />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Delivered' value={1840} />} key='2'>
          <Trips trips={trip} delivered />
        </TabPane>
        <TabPane tab={<TitleWithCount name='POD Verified' value={42} />} key='3'>
          <Trips trips={trip} delivered />
        </TabPane>
        <TabPane tab={<TitleWithCount name='Invoiced' value={451} />} key='4'>
          <Trips trips={trip} delivered />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default TripsContainer
