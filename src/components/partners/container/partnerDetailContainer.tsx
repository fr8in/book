import { useState } from 'react'
import Link from 'next/link'
import { Row, Col, Card, Tabs, Button, Space, Tooltip } from 'antd'
import { CarOutlined, WalletOutlined, FileTextOutlined, MailOutlined } from '@ant-design/icons'
import DetailPageHeader from '../../common/detailPageHeader'
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
import TitleWithCount from '../../common/titleWithCount'
import FasTags from '../cards/fasTags'
import PartnerFuelDetail from '../cards/partnerFuelDetail'
import WalletTopUp from '../walletTopup'
import PaidContainer from '../container/paidContainer'
import useShowHide from '../../../hooks/useShowHide'

import { useSubscription } from '@apollo/client'
import { PARTNER_DETAIL_SUBSCRIPTION } from './query/partnerDetailSubscription'
import ReportEmail from '../reportEmail'
import WalletStatement from '../walletStatement'
const TabPane = Tabs.TabPane

const on_going = ['Confirmed', 'Reported at source', 'Intransit', 'Reported at destination']
const pod = ['Delivered']
const invoiced = ['Invoiced', 'Recieved']
const paid = ['Paid', 'Closed']
const PartnerDetailContainer = (props) => {
  const initial = { topUp: false, reportMail: false, statememt: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [tripStatusId, setTripStatusId] = useState(on_going)

  const onStatusChange = (key) => {
    console.log('key', key)
    if (key === '4') {
      setTripStatusId(on_going)
    }
    if (key === '5') {
      setTripStatusId(pod)
    }
    if (key === '6') {
      setTripStatusId(invoiced)
    }
  }
  const { cardcode, partner_id } = props
  const { loading, error, data } = useSubscription(
    PARTNER_DETAIL_SUBSCRIPTION,
    {
      variables: {
        cardcode: cardcode,
        partner_id: partner_id,
        trip_status_value: tripStatusId,
        ongoing: on_going,
        pod: pod,
        invoiced: invoiced,
        paid: paid
      }
    }
  )

  console.log('PartnerDetailContainer Error', error)
  console.log('PartnerDetailContainer Data', data)

  var partner_info = {}
  var trucks = {}
  var trips = {}
  var truck_count = 0
  var ongoing_count = 0
  var pod_count = 0
  var invoiced_count = 0
  var paid_count = 0
  var fas_tag = {}
  if (!loading) {
    const { partner } = data
    partner_info = partner[0] ? partner[0] : { name: 'ID does not exist' }
    trucks = partner_info.trucks
    trips = partner_info.trips
    fas_tag = partner_info.fastags
    console.log('partner_info', partner_info)
    console.log('trucks', trucks)
    console.log('fas_tag', fas_tag)
    truck_count = partner_info.trucks_aggregate && partner_info.trucks_aggregate.aggregate && partner_info.trucks_aggregate.aggregate.count
    ongoing_count = partner_info.ongoing && partner_info.ongoing.aggregate && partner_info.ongoing.aggregate.count
    pod_count = partner_info.pod && partner_info.pod.aggregate && partner_info.pod.aggregate.count
    invoiced_count = partner_info.invoiced && partner_info.invoiced.aggregate && partner_info.invoiced.aggregate.count
    paid_count = partner_info.paid && partner_info.paid.aggregate && partner_info.paid.aggregate.count
  }

  return (
    <Row>
      <Col xs={24}>
        <Card
          size='small'
          className='border-top-blue'
          title={
            <DetailPageHeader
              title={<HeaderInfo partner={partner_info} />}
              extra={
                <Space>
                  <Tooltip title='Account Statement'>
                    <Button icon={<MailOutlined />} shape='circle' onClick={() => onShow('reportMail')} />
                  </Tooltip>
                  <Tooltip title='Wallet Statement'>
                    <Button icon={<FileTextOutlined />} shape='circle' onClick={() => onShow('statement')} />
                  </Tooltip>
                  <Tooltip title='Wallet Topup'>
                    <Button shape='circle' icon={<WalletOutlined />} onClick={() => onShow('topUp')} />
                  </Tooltip>
                  <Link href='/trucks/addtruck/[id]' as={`/trucks/addtruck/${'ST003579'}`}>
                    <Tooltip title='Add Truck'>
                      <Button type='primary' className='addtruck' shape='circle' icon={<CarOutlined />} />
                    </Tooltip>
                  </Link>
                  <WalletStatus cardcode={partner_info.cardcode} status={partner_info.wallet_block} />
                </Space>
              }
            />
          }
        >
          <Row>
            <Col xs={24} sm={16} md={16}>
              <BasicDetail partnerInfo={partner_info} />
            </Col>
            <Col xs={24} sm={8} md={8}>
              <PartnerStatus partnerInfo={partner_info} />
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <Card size='small' className='card-body-0 border-top-blue'>
                <Tabs defaultActiveKey='1' onChange={onStatusChange}>
                  <TabPane tab='Detail' key='1'>
                    <Row gutter={10} className='p10'>
                      <Col xs={24} sm={12} md={12}>
                        <DetailInfo partnerDetail={partner_info} />
                      </Col>
                      <Col xs={24} sm={12} md={12}>
                        <Card size='small' className='card-body-0'>
                          <Tabs defaultActiveKey='1'>
                            <TabPane tab='Summary' key='1'>
                              <AccountSummary />
                              <PendingBalance />
                              <AvailableBalance />
                            </TabPane>
                            <TabPane tab='Order Report' key='2'>
                              <Barchart />
                            </TabPane>
                            <TabPane tab='Documents' key='3'>
                              <Document partnerInfo={partner_info} />
                            </TabPane>
                            <TabPane tab='Fuel Detail' key='4'>
                              <PartnerFuelDetail />
                            </TabPane>
                            <TabPane tab='FasTag' key='5'>
                              <FasTags fastag={fas_tag} />
                            </TabPane>
                          </Tabs>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane
                    tab={
                      <TitleWithCount
                        name='Truck'
                        value={truck_count}
                      />
                    }
                    key='2'
                  >
                    <PartnerTruck trucks={trucks} loading={loading} />
                  </TabPane>
                  <TabPane tab='Comment' key='3'>
                    <div className='p10'>
                      <Comment partner_id={partner_info.id} loading={loading} />
                    </div>
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='On-going' value={ongoing_count} />} key='4'>
                    <TripDetail trips={trips} loading={loading} />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='POD' value={pod_count} />} key='5'>
                    <TripDetail trips={trips} loading={loading} />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Invoiced' value={invoiced_count} />} key='6'>
                    <TripDetail trips={trips} loading={loading} />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Paid' value={paid_count} />} key='7'>
                    <PaidContainer cardcode={cardcode} />
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
      {visible.topUp && <WalletTopUp visible={visible.topUp} onHide={onHide} />}
      {visible.reportMail && <ReportEmail visible={visible.reportMail} onHide={onHide} />}
      {visible.statement && <WalletStatement visible={visible.statement} onHide={onHide} cardcode={partner_info.cardcode} />}
    </Row>
  )
}

export default PartnerDetailContainer
