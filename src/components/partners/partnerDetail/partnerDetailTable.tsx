import React from 'react'
import {Row,Col,Card, Tabs } from 'antd'
import PageLayout from '../../../components/layout/pageLayout'
import TripDetail from '../../trips/tripsByStages'
import PartnerTruck from '../../../components/trucks/trucksByPartner'
import Detail from '../../../components/partners/partnerDetail/detail'
import Comment from './comment'
const TabPane = Tabs.TabPane

export default function partnerDetailTable() {
    const callback = (key) => {
        console.log(key)
      }
    return (
        <PageLayout title='Partner'>
           <Row gutter={[10, 10]}>
        <Col sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs defaultActiveKey='1' onChange={callback}>
                <TabPane tab='Truck' key='1'>
                    <PartnerTruck />
                </TabPane>
                <TabPane tab='Detail' key='2'>
                    <Detail />
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
        </PageLayout>
    )
}
