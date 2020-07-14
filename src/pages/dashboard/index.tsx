
import { useState } from 'react'
import { Row, Col, Card, Tabs, Collapse, Button, Tooltip, Input } from 'antd'
import PageLayout from '../../components/layout/pageLayout'
import Trips from '../../components/trips/activeTrips'
import WaitingForLoad from '../../components/trucks/waitingForLoad'
import Orders from '../../components/reports/orders'
import Revenue from '../../components/reports/revenue'
import Progress from '../../components/reports/progress'
import { WhatsAppOutlined, FullscreenOutlined } from '@ant-design/icons'

const { TabPane } = Tabs
const { Panel } = Collapse
const Dashboard = () => {
  const [tabAkey, setTabAkey] = useState('1')
  const callback = (key) => {
    setTabAkey(key)
  }
  return (
    <PageLayout title='Dashboard'>
      <Row gutter={[10, 10]}>
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
      {/** All trips status wise: Filter applocable for Source city
        ** Waiting for load and Delivery On-hold records */}
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs
              defaultActiveKey='1'
              onChange={callback}
              tabBarExtraContent={
                <span className='extra'>
                  <Button size='small' type='primary' shape='circle' icon={<WhatsAppOutlined />} />
                  <Tooltip title='Full Screen Mode'>
                    <Button size='small' type='primary' shape='circle' icon={<FullscreenOutlined />} />
                  </Tooltip>
                  {tabAkey === '1' &&
                    <Input placeholder='Search Truck...' style={{ width: 'auto' }} />}
                </span>
              }
            >
              <TabPane tab='Unloading(s)' key='2'>
                <Trips />
              </TabPane>
              <TabPane tab='Load' key='1'>
                <WaitingForLoad />
              </TabPane>
              <TabPane tab='Assigned' key='3'>
                <Trips />
              </TabPane>
              <TabPane tab='Confirmed' key='4'>
                <Trips />
              </TabPane>
              <TabPane tab='Loading' key='5'>
                <Trips />
              </TabPane>
              <TabPane tab='Intransit(S)' key='6'>
                <Trips intransit />
              </TabPane>
              <TabPane tab='Delivery On-hold' key='7'>
                <Trips />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
      {/** Unloading and Intransit: Filter applocable for Destination city */}
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs
              defaultActiveKey='1'
              onChange={callback}
              tabBarExtraContent={
                <span className='extra'>
                  <Input placeholder='Search Truck...' style={{ width: 'auto' }} />
                </span>
              }
            >
              <TabPane tab='Unloading(D)' key='1'>
                <Trips />
              </TabPane>
              <TabPane tab='Intransit(D)' key='2'>
                <Trips intransit />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
      {/** Excess Trips */}
      <Row>
        <Col xs={24} sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Collapse
              onChange={callback}
              ghost
              accordion
            >
              <Panel header='Loads' key='1'>
                <Trips />
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}

export default Dashboard
