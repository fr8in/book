import React from 'react'
import Link from 'next/link'
import { Row, Col, Card, Tabs, Button } from 'antd'
import HeaderInfo from '../partner'
import WalletStatus from '../walletStatus'
import BasicDetail from '../partnerInfo'
import Barchart from '../barChart'
import AccountSummary from '../accountSummary'
import PendingBalance from '../pendingBalance'
import AvailableBalance from '../availableBalance'
import PartnerStatus from '../partnerStatus'
import TripDetail from '../../trips/tripsByStages'
import PartnerTruck from '../../trucks/trucksByPartner'
import DetailInfo from '../partnerDetail'
import Document from '../partnerDocument'
import Comment from '../comment'
import { PlusOutlined } from '@ant-design/icons'
import TitleWithCount from '../../common/titleWithCount'

const TabPane = Tabs.TabPane

const PartnerDetailContainer = () => {
  const callback = (key) => {
    console.log(key)
  }
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
              extra={<WalletStatus />}
            >
              <Row gutter={[10, 10]}>
                <Col xs={24} sm={12} md={8}>
                  <BasicDetail />
                  <PartnerStatus />
                  <Link href='/trucks/addtruck/[id]'>
                    <Button type='primary' icon={<PlusOutlined />}>
                       Add Truck
                    </Button>
                  </Link>
                </Col>
                <Col xs={24} md={12} xl={8}>
                  <Barchart />
                </Col>
                <Col xs={24} md={24} xl={8}>
                  <AccountSummary />
                  <PendingBalance />
                  <AvailableBalance />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col sm={24}>
            <Card size='small' className='card-body-0 border-top-blue'>
              <Tabs defaultActiveKey='1' onChange={callback}>
                <TabPane tab='Truck' key='1'>
                  <PartnerTruck />
                </TabPane>
                <TabPane tab='Detail' key='2'>
                  <br />
                  <Row gutter={[8, 8]} justify='space-around'>
                    <Col xs={24} sm={12} md={12}>
                      <DetailInfo />
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                      <Document />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab='Comment' key='3'>
                  <Comment />
                </TabPane>
                <TabPane tab={<TitleWithCount name='On-going' value={5} />} key='4'>
                  <TripDetail />
                </TabPane>
                <TabPane tab={<TitleWithCount name='POD' value={null} />} key='5'>
                  <TripDetail />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Invoiced' value={0} />} key='6'>
                  <TripDetail />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Paid' value={14} />} key='7'>
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

export default PartnerDetailContainer
