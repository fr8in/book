import { useState } from 'react'
import FasTags from '../fasTags'
import FuelCards from '../fuelCards'

import Link from 'next/link'
import { Tabs, Row, Card, Button, Space } from 'antd'

import { PlusCircleOutlined, RedoOutlined } from '@ant-design/icons'
const TabPane = Tabs.TabPane

const Cards = () => {
  const [tabKey, setTabKey] = useState('1')

  const tabChange = (key) => {
    setTabKey(key)
  }

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs
        onChange={tabChange}
        tabBarExtraContent={
          <span>
            {tabKey === '1' &&
              <Space>
                <Button shape='circle' size='small' icon={<RedoOutlined />} />
                <Link href='cards/add-fuelcard'>
                  <Button type='primary' size='small' icon={<PlusCircleOutlined />}>Add Card</Button>
                </Link>
              </Space>}
            {tabKey === '2' &&
              <Link href='cards/add-fastag'>
                <Button type='primary' size='small' icon={<PlusCircleOutlined />}>Add Card</Button>
              </Link>}
          </span>
        }
      >
        <TabPane tab='Fuel Card' key='1'>
          <Row justify='end' className='m5' />
          <FuelCards />
        </TabPane>
        <TabPane tab='FASTag' key='2'>
          <FasTags />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default Cards
