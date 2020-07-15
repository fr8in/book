import React from 'react'
import { Tabs } from 'antd'
import PageLayout from '../../../components/layout/pageLayout'
import TripDetail from '../../../components/trips/tripDetail/tripDetailByPartner'
import PartnerTruck from '../../../components/trucks/truckDetail/trucksByPartner'
import DetailInfo from '../../../components/partners/partnerDetail/partnerDetailInfo'
import Comment from '../../../components/partners/partnerDetail/partnerComment'
const TabPane = Tabs.TabPane

export default function partnerDetailTable() {
    return (
        <PageLayout title='Partner'>
            <Tabs >
                <TabPane tab='Truck' key='1'>
                    <PartnerTruck />
                </TabPane>
                <TabPane tab='Detail' key='2'>
                    <DetailInfo />
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
        </PageLayout>
    )
}
