import Link from 'next/link'
import { useState, useContext } from 'react'
import { Row, Col, Card, Tabs, Button, Space, Tooltip } from 'antd'
import { CarOutlined, WalletOutlined, FileTextOutlined, MailOutlined,BookOutlined ,PlusCircleOutlined, BankOutlined } from '@ant-design/icons'
import DetailPageHeader from '../../common/detailPageHeader'
import HeaderInfo from '../partner'
import WalletStatus from '../walletStatus'
import BasicDetail from '../partnerInfo'
import Barchart from '../barChart'
import AccountSummary from '../accountSummary'
import PendingBalance from '../pendingBalance'
import AvailableBalance from '../availableBalance'
import PartnerStatus from '../partnerStatus'
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
import get from 'lodash/get'
import { useSubscription } from '@apollo/client'
import { PARTNER_DETAIL_SUBSCRIPTION } from './query/partnerDetailSubscription'
import ReportEmail from '../reportEmail'
import WalletStatement from '../walletStatement'
import Loading from '../../common/loading'
import PartnerTripContainer from './partnerTripContainer'
import WalletToBank from '../walletToBank'
import u from '../../../lib/util'
import userContext from '../../../lib/userContaxt'
import AdhocWalletTopup from '../adhocWalleTopup'

const TabPane = Tabs.TabPane

const on_going = ['Confirmed', 'Reported at source', 'Intransit', 'Reported at destination', 'Intransit halting']
const pod = ['Delivered']
const invoiced = ['Invoiced', 'Recieved']
const paid = ['Paid', 'Closed']

const PartnerDetailContainer = (props) => {
  const [Key, setKey] = useState('1')

  const tabChange = (key) => {
    setKey(key)
  }

  const initial = { topUp: false, reportMail: false, statememt: false, walletToBank: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const { cardcode, partner_id } = props
  const context = useContext(userContext)
  const { role } = u
  const _edit_access = [role.admin, role.partner_manager, role.onboarding]
  const partner_access = u.is_roles(_edit_access, context)
  const _admin_role = [role.admin, role.partner_manager, role.partner_support]
  const _top_up_role = [role.admin, role.rm, role.partner_manager, role.partner_support]
  const admin = u.is_roles(_admin_role, context)
  const top_up_access = u.is_roles(_top_up_role, context)
  const _wallet_role = [role.admin]
  const wallet_activate_role = u.is_roles(_wallet_role, context)

  const { loading, error, data } = useSubscription(
    PARTNER_DETAIL_SUBSCRIPTION,
    {
      variables: {
        cardcode: cardcode,
        partner_id: partner_id,
        ongoing: on_going,
        pod: pod,
        invoiced: invoiced,
        paid: paid  
      }
    }
  )

  console.log('PartnerDetailContainer Error', error)

  let _data = {}

  if (!loading) {
    _data = data
  }

  const partner_info = get(_data, 'partner[0]', 'ID does not exist')
  const truck_count = get(partner_info, 'trucks_aggregate.aggregate.count', 0)
  const ongoing_count = get(partner_info, 'ongoing.aggregate.count', 0)
  const pod_count = get(partner_info, 'pod.aggregate.count', 0)
  const invoiced_count = get(partner_info, 'invoiced.aggregate.count', 0)
  const paid_count = get(partner_info, 'paid.aggregate.count', 0)

  const partner_status = get(partner_info, 'partner_status.name', null)
  const after_onboard = partner_status === 'Active' || partner_status === 'De-activate' || partner_status === 'Blacklisted'
  const adhocWalleTopup_validation = wallet_activate_role 
 
  return (
    loading ? <Loading /> : (
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
                    {admin &&
                    <div className='text-center'>
                      <Tooltip title='Wallet to Bank'>
                        <Button icon={<BankOutlined />} shape='circle' onClick={() => onShow('walletToBank')} />
                      </Tooltip>
                      <p className='tinyAction'>Bank</p>
                      </div>}
                    <div className='text-center'>
                      <Button icon={<MailOutlined />} shape='circle' onClick={() => onShow('reportMail')} />
                      <p className='tinyAction'>Email</p>
                    </div>
                    <div className='text-center'>
                      <Button icon={<FileTextOutlined />} shape='circle' onClick={() => onShow('statement')} />
                      <p className='tinyAction'>Statement</p>
                      </div>
                    {partner_info.partner_status === 'Blacklisted' ? wallet_activate_role : top_up_access &&
                       <div className='text-center'>
                        <Button shape='circle' icon={<WalletOutlined />} onClick={() => onShow('topUp')} />
                        <p className='tinyAction'>Topup</p>
                      </div>}
                     { adhocWalleTopup_validation &&
                     <div className='text-center'>
                      <Tooltip title='Adhoc Wallet Topup'>
                        <Button shape='circle' icon={<BookOutlined />} onClick={() => onShow('adhoctopUp')}/>
                      </Tooltip>
                       <p className='tinyAction'>Adhoc</p>
                       </div>} 
                    <Link href='/trucks/addtruck/[id]' as={`/trucks/addtruck/${cardcode}`}>
                      <Tooltip title='Add Truck'>
                        <Button type='primary' className='addtruck' shape='circle' icon={<CarOutlined />}  />
                      </Tooltip>
                    </Link>
                    <WalletStatus id={partner_info.id} status={partner_info.wallet_block} />
                  </Space>
                }
              />
            }
          >
            <Row>
              <Col xs={24} sm={16} md={16}>
                <BasicDetail partnerInfo={partner_info} />
              </Col>
              <Col xs={24} sm={8} md={8} className='text-right'>
                {after_onboard &&
                  <PartnerStatus partnerInfo={partner_info} />}
              </Col>
            </Row>
            <Row>
              <Col sm={24}>
                <Card size='small' className='card-body-0 border-top-blue'>
                  <Tabs defaultActiveKey='1'>
                    <TabPane tab='Detail' key='1'>
                      <Row gutter={10} className='p10'>
                        <Col xs={24} sm={12} md={12}>
                          <DetailInfo partnerDetail={partner_info} />
                        </Col>
                        <Col xs={24} sm={12} md={12}>
                          <Card size='small' className='card-body-0'>
                            <Tabs
                              defaultActiveKey='1'
                              onChange={tabChange}
                              tabBarExtraContent={
                                <span>
                                  {Key === '5' && partner_access && (
                                      <Link href='/partners/AddFastag/[id]' as={`/partners/AddFastag/${cardcode}`}>
                                      <Button
                                        type='primary'
                                        size='small'
                                        icon={<PlusCircleOutlined />}
                                      >
                                        Add Card
                                      </Button>
                                    </Link>
                                  )}
                                </span>
                              }
                            >
                              <TabPane tab='Summary' key='1'>
                                <AccountSummary partner_summary={partner_info} />
                                <PendingBalance partner_summary={partner_info} />
                                <AvailableBalance partner_summary={partner_info} />
                              </TabPane>
                              <TabPane tab='Order Report' key='2'>
                                <Barchart partner_id={partner_info.id}/>
                              </TabPane>
                              <TabPane tab='Documents' key='3'>
                                <Document partnerInfo={partner_info} />
                              </TabPane>
                              <TabPane tab='Fuel Detail' key='4'>
                                <PartnerFuelDetail partner_id={partner_info.id} />
                              </TabPane>
                              <TabPane tab='FasTag' key='5'>
                                <FasTags partner_id={partner_info.id} />
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
                      <PartnerTruck cardcode={cardcode} />
                    </TabPane>
                    <TabPane tab='Comment' key='3'>
                      <div className='p10'>
                        <Comment partner_id={partner_info.id} loading={loading} detailPage />
                      </div>
                    </TabPane>
                    <TabPane tab={<TitleWithCount name='On-going' value={ongoing_count} />} key='4'>
                      <PartnerTripContainer cardcode={cardcode} trip_status={on_going} />
                    </TabPane>
                    <TabPane tab={<TitleWithCount name='POD' value={pod_count} />} key='5'>
                      <PartnerTripContainer cardcode={cardcode} trip_status={pod} />
                    </TabPane>
                    <TabPane tab={<TitleWithCount name='Invoiced' value={invoiced_count} />} key='6'>
                      <PartnerTripContainer cardcode={cardcode} trip_status={invoiced} />
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
        {visible.walletToBank &&
          <WalletToBank
            visible={visible.walletToBank}
            onHide={onHide}
            partner_id={partner_info.id}
            balance={get(partner_info, 'partner_accounting.wallet_balance', 0)}
          />}
        {visible.topUp && <WalletTopUp visible={visible.topUp} onHide={onHide} partner_id={partner_info.id} />}
        {visible.adhoctopUp && <AdhocWalletTopup visible={visible.adhoctopUp} onHide={onHide} partner_info={partner_info} partner_id={partner_info.id} />}
        {visible.reportMail && <ReportEmail visible={visible.reportMail} onHide={onHide} cardcode={cardcode} />}
        {visible.statement && <WalletStatement visible={visible.statement} onHide={onHide} cardcode={partner_info.cardcode} />}
      </Row>)
  )
}

export default PartnerDetailContainer
