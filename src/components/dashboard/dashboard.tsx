import { useState } from 'react'
import { Row, Col, Card, Tabs, Button, Space } from 'antd'
import Trips from '../trips/activeTrips'
import WaitingForLoad from '../trucks/waitingForLoad'
import Orders from '../reports/orders'
import Revenue from '../reports/revenue'
import Progress from '../reports/progress'
import { WhatsAppOutlined, CarOutlined } from '@ant-design/icons'
import ExcessLoad from '../trips/excessLoad'
import TitleWithCount from '../common/titleWithCount'

const { TabPane } = Tabs

const Dashboard = () => {
  const [tabKey, setTabKey] = useState('1')
  const callback = (key) => {
    setTabKey(key)
  }
  return (
    <Row>
      <Col xs={24}>
        {/* Statictics data */}
        <Row gutter={[0, 10]}>
          <Col xs={24} style={{ overflow: 'hidden' }}>
            <Row gutter={10}>
              <Col xs={24} sm={9} md={8}>
                <Orders />
              </Col>
              <Col xs={24} sm={15} md={8}>
                <Revenue />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Progress />
              </Col>
            </Row>
          </Col>
        </Row>
        {/** All trips status wise: Filter applocable for Source city
        ** Waiting for load and Delivery On-hold records */}
        <Row gutter={[0, 10]}>
          <Col xs={24} sm={24}>
            <Card size='small' className='card-body-0 border-top-blue'>
              <Tabs
                defaultActiveKey='1'
                onChange={callback}
                tabBarExtraContent={
                  <Space>
                    <Button size='small' shape='circle' icon={<WhatsAppOutlined />} />
                    <Button size='small' type='primary' shape='circle' icon={<CarOutlined />} />
                  </Space>
                }
              >
                <TabPane tab={<TitleWithCount name='Unloading' value={20} />} key='2'>
                  <Trips />
                </TabPane>
                <TabPane tab={<TitleWithCount name='WF.Load' value={200} />} key='1'>
                  <WaitingForLoad />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Assigned' value={57} />} key='3'>
                  <Trips />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Confirmed' value={57} />} key='4'>
                  <Trips />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loading' value={5} />} key='5'>
                  <Trips />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit' value={36} />} key='6'>
                  <Trips intransit />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit(D)' value={57} />} key='7'>
                  <Trips intransit />
                </TabPane>
                <TabPane tab='Unloading(D)' key='8'>
                  <Trips />
                </TabPane>
                <TabPane tab='Loads' key='9'>
                  <ExcessLoad />
                </TabPane>
                <TabPane tab='Hold' key='10'>
                  <Trips />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Dashboard
