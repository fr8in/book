import React from 'react'
import { Tabs, Input, Row, Col, Button } from "antd";
import { UserAddOutlined, FilterOutlined } from '@ant-design/icons'
import PartnerKyc from '../../partners/partnerKyc'
import PartnerLead from '../../partners/partnerLead'
import TruckVerification from '../truckVerrification'
import VasRequest from '../vasRequest'
import Breakdown from '../breakdown'
import Announcenmemt from '../announcement'
import Customer from '../customer'
const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}
export default function sourcingContainer() {
  return (
    <div>
      <Tabs>
        <TabPane tab="Partner" key="1">
          <Tabs onChange={callback} type="card" className='card-body-0'>
            <TabPane tab="KYC Verification" key="1">
              <Row gutter={8} justify='end' className='m5'>
                <Col span={3}>
                  <Input placeholder="Search Partner Codeor Name" />
                </Col>
              </Row>
              <PartnerKyc />
            </TabPane>
            <TabPane tab="Truck Verification" key="2">
              <Row gutter={8} justify='end' className='m5'>
                <Col span={3}>
                  <Input placeholder="Search..." />
                </Col>
              </Row>
              < TruckVerification />
            </TabPane>
            <TabPane tab="Lead" key="3">
            <Row gutter={8} justify='end' className='m5'>
            <Col>
              <Button type="primary"> Assign </Button>
              </Col>
              <Col>
              <Button type="primary" icon={<FilterOutlined />} />
              </Col>
            <Col>
              <Button type="primary" icon={<UserAddOutlined />} />
            </Col>
            </Row>
              <PartnerLead />
              
            </TabPane>
            <TabPane tab="Vas Request" key="4">
              <VasRequest />
                </TabPane>
          </Tabs>,
        </TabPane>

        <TabPane tab="Customer" key="2">
         <Customer />
        </TabPane>
        <TabPane tab="Waiting For Load" key="3">
         <Breakdown />
        </TabPane>
        <TabPane tab="Breakdown" key="4">
        <Breakdown />
        </TabPane>
        <TabPane tab="Announcement" key="5">
          <Announcenmemt />
        </TabPane>
      </Tabs>
    </div>
  )
}
