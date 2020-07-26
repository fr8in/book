import Loading from '../../common/loading'
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
import useShowHide from '../../../hooks/useShowHide'

import { useSubscription } from '@apollo/client'
import { PARTNER_DETAIL_SUBSCRIPTION } from './query/partnerDetailSubscription'
import ReportEmail from '../reportEmail'
import WalletStatement from '../walletStatement'
const TabPane = Tabs.TabPane

const tripStatusId = [2, 3, 4, 5, 6]

const PartnerDetailContainer = (props) => {
  const initial = { topUp: false, reportMail: false, statememt: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const { cardcode } = props
  const { loading, error, data } = useSubscription(
    PARTNER_DETAIL_SUBSCRIPTION,
    {
      variables: { cardcode, trip_status_id: tripStatusId }
    }
  )

  if (loading) return <Loading />
  console.log('PartnerDetailContainer Error', error)
  console.log('PartnerDetailContainer Data', data)
  const { partner } = data
  const partnerData = partner[0] ? partner[0] : { name: 'ID does not exist' }
  const trucks = partnerData.trucks
  console.log('trucks', trucks)
  const callback = (key) => {
    console.log(key)
  }
  return (
    <Row>
      <Col xs={24}>
        <Card
          size='small'
          className='border-top-blue'
          title={
            <DetailPageHeader
              title={<HeaderInfo partner={partnerData} />}
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
                  <WalletStatus cardcode={partnerData.cardcode} status={partnerData.wallet_block} />
                </Space>
              }
            />
          }
        >
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={16} md={16}>
              <BasicDetail partnerInfo={partnerData} />
            </Col>
            <Col xs={24} sm={8} md={8}>
              <PartnerStatus />
            </Col>
          </Row>
          <Row>
            <Col sm={24}>
              <Card size='small' className='card-body-0 border-top-blue'>
                <Tabs defaultActiveKey='1' onChange={callback}>
                  <TabPane tab={<TitleWithCount name='Truck' value={2} />} key='1'>
                    <PartnerTruck trucks={trucks} />
                  </TabPane>
                  <TabPane tab='Detail' key='2'>
                    <Row gutter={10} className='p10'>
                      <Col xs={24} sm={12} md={12}>
                        <DetailInfo partnerDetail={partnerData} />
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
                              <Document />
                            </TabPane>
                            <TabPane tab='Fuel Detail' key='4'>
                              <PartnerFuelDetail />
                            </TabPane>
                            <TabPane tab='FasTag' key='5'>
                              <FasTags />
                            </TabPane>
                          </Tabs>
                        </Card>
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
        </Card>
      </Col>
      {visible.topUp && <WalletTopUp visible={visible.topUp} onHide={onHide} />}
      {visible.reportMail && <ReportEmail visible={visible.reportMail} onHide={onHide} />}
      {visible.statement && <WalletStatement visible={visible.statement} onHide={onHide} />}
    </Row>
  )
}

export default PartnerDetailContainer
