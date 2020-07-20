import React from 'react'
import { Row, Col, Card, Space, Tag, Tabs, Collapse } from 'antd'
import data from '../../../mock/trip/tripDetail'
import TripInfo from './tripInfo'
import TripLr from './tripLr'
import TripTime from './tripTime'
import BillingComment from './billingComment'
import TripPod from './tripPod'
import TripInvoice from './tripInvoice'

const { TabPane } = Tabs
const { Panel } = Collapse

const TripDetail = (props) => {
  console.log('tripId', props)
  const title = (
    <h3>
      <span className='text-primary'>{props.tripId}</span>
      <span>:&nbsp;{`${data.trip.source} - ${data.trip.Destination}`}&nbsp;</span>
      <small className='text-gray normal'>{data.device.truckType}</small>
    </h3>)
  return (
    <Card
      size='small'
      className='border-top-blue'
      title={title}
      extra={
        <Space>
          <span>Status:</span>
          <Tag className='status'>{data.trip.status}</Tag>
        </Space>
      }
    >
      <Row gutter={10}>
        <Col xs={24} sm={24} md={14}>
          <TripInfo data={data} />
          <Collapse accordion className='small mt10'>
            <Panel header='Trip LR' key='1'>
              <TripLr />
            </Panel>
          </Collapse>
          <TripTime />
          <Collapse accordion className='small mt10'>
            <Panel header='Customer/Partner - Billing Comment' key='1'>
              <BillingComment />
            </Panel>
          </Collapse>
        </Col>
        <Col xs={24} sm={24} md={10}>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Billing' key='1'>
              <Collapse accordion className='small'>
                <Panel header='Trip POD' key='1'>
                  <TripPod />
                </Panel>
              </Collapse>
              <Collapse accordion className='small box-0 mt10'>
                <Panel header='Invoice' key='1'>
                  <TripInvoice />
                </Panel>
              </Collapse>
            </TabPane>
            <TabPane tab='Payment' key='2'>
              Payment
            </TabPane>
            <TabPane tab='Timeline' key='3'>
              Timeline
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  )
}

export default TripDetail
