import React from 'react'
import {Row,Col,Card, Tabs, Divider } from 'antd'
import HeaderInfo from '../partner'
import WalletStatus from '../walletStatus'
import BasicDetail from '../partnerInfo'
import Barchart from '../barChart'
import Summary from '../summary'
import PartnerStatus from '../partnerStatus'
import TripDetail from '../../trips/tripsByStages'
import PartnerTruck from '../../trucks/truckDetail/trucksByPartner'
import DetailInfo from '../partnerDetail'
import Document from '../partnerDocument'
import Comment from '../comment'
const TabPane = Tabs.TabPane

const callback = (key) => {
    console.log(key)
  }
export default function partnerDetailContainer() {
    return (
        <div>
              <Row>   
        <Col span={22}>
          <HeaderInfo/>
        </Col>
        <Col>
          <WalletStatus />
        </Col>
      </Row>
     
      <Divider />
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={12} md={8}>
          <BasicDetail/>
          <br />
          <PartnerStatus/>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Barchart/>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Summary/>
        </Col>
      </Row>
      <br />
      <Row gutter={[10, 10]}>
        <Col sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs defaultActiveKey='1' onChange={callback}>
                <TabPane tab='Truck' key='1'>
                    <PartnerTruck />
                </TabPane>
                <TabPane tab='Detail' key='2'>
                  <br />
                <Row gutter={[15, 15]}>
                <Col xs={24} sm={24}md={12}>
                <DetailInfo/>
                </Col>
                <Col xs={24} sm={24} md={12}>
                <Document />
                </Col>
              
            </Row>
                </TabPane>
                <TabPane tab='Comment' key='3'>
                     <Comment />
                </TabPane>
                <TabPane tab='On-going' key='4'>
                    <TripDetail />
                </TabPane>
                <TabPane tab='POD' key='5'>
                    <TripDetail />
                </TabPane>
                <TabPane tab='Invoiced' key='6'>
                    <TripDetail />
                </TabPane>
                <TabPane tab='Paid' key='7'>
                    <TripDetail />
                </TabPane>
            </Tabs>
            </Card>
        </Col>
      </Row>
        </div>
    )
}
