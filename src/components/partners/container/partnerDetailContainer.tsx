import React from 'react'
import {Row,Col,Card, Tabs, Divider } from 'antd'
import HeaderInfo from '../partner'
import WalletStatus from '../walletStatus'
import BasicDetail from '../partnerInfo'
import Barchart from '../barChart'
import AccountSummary from '../accountSummary'
import PendingBalance from '../pendingBalance'
import AvailableBalance from '../availableBalance'
import PartnerStatus from '../partnerStatus'
import TripDetail from '../../trips/tripsByStages'
import PartnerTruck from '../../trucks/truckDetail/trucksByPartner'
import DetailInfo from '../partnerDetail'
import Document from '../partnerDocument'
import Comment from '../comment'
import { CrownFilled } from '@ant-design/icons'

const TabPane = Tabs.TabPane

const callback = (key) => {
    console.log(key)
  }
export default function partnerDetailContainer() {
    return (
       
    <Row>
      <Col xs={24}>
        <Row gutter={[10, 10]}>
          <Col xs={24}>
            <Card
              size='small'
              className='border-top-blue'
              title={
                <HeaderInfo />
              }
              extra={ <WalletStatus /> }
            >
            
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={12} md={8}>
          <br />
          <BasicDetail/>
          <br />
          <br />
          <PartnerStatus/>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Barchart/>
        </Col>
        <Col xs={24} sm={24} md={8}>
         
         <AccountSummary />
         <PendingBalance />
         <AvailableBalance />
        
        </Col>
      </Row>
      </Card>
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
                <Row gutter={[8, 8]} justify="space-around">
                <Col xs={24} sm={12}md={12}>
                <DetailInfo/>
                </Col>
                <Col xs={24} sm={12} md={12}>
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
       </Col>
       </Row>
    )
}
