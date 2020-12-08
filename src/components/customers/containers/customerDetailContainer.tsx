import { Row, Col, Card, Button, Space, Tabs } from 'antd'
import get from 'lodash/get'
import {
  BankFilled,
  FileDoneOutlined,
  WalletOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import useShowHide from '../../../hooks/useShowHide'
import AccStmtMail from '../stmtMail'
import DetailPageHeader from '../../common/detailPageHeader'
import CustomerName from '../customerName'
import Blacklist from '../blacklist'
import CustomerInfo from '../customerInfo'
import CustomerDetails from '../customerDetails'
import Transfer from '../transfer'
import Rebate from '../rebate'
import WalletTopup from '../walletTopup'
import WalletBalance from '../walletBalance'
 import PendingPayments from '../pendingPayments'
import CustomerTrips from '../customerTrips'
import CustomerClosedTrips from '../customerClosedTrips'
import IncomingPayments from '../incomingPayments'
import Users from '../users'
import Branch from '../branch'
import Fr8Branch from '../../customers/containers/fr8branchContainer'
import CustomerUser from '../createCustomerUser'
import CustomerBranch from '../createCustomerBranch'
import TitleWithCount from '../../common/titleWithCount'
import u from '../../../lib/util'
import userContext from '../../../lib/userContaxt'
import { useContext } from 'react'
import CustomerComment from '../customerComment'
import isEmpty from 'lodash/isEmpty'
import TransferHistory from '../transferToBankHistory'

// Apollo Client
import { useSubscription } from '@apollo/client'
import { CUSTOMER_DETAIL_SUBSCRIPTION } from './query/cutomerDetailSubscription'
import Loading from '../../common/loading'

const { TabPane } = Tabs

const ongoing = ['Assigned', 'Confirmed', 'Reported at source', 'Intransit', 'Reported at destination', 'Intransit halting']
const delivered = ['Delivered']
const invoiced = ['Invoiced', 'Paid']
const recieved = ['Recieved', 'Closed']

const CustomerDetailContainer = (props) => {
  const { cardcode } = props
  const initial = {
    transfer: false,
    rebate: false,
    wallet: false,
    addUser: false,
    addBranch: false
  }
  const { visible, onShow, onHide } = useShowHide(initial)
  const { role } = u
  const customerNameEdit = [role.admin, role.accounts_manager, role.accounts]
  const BlacklistEdit = [role.admin, role.accounts_manager, role.accounts,role.bm,role.rm,role.partner_manager,role.partner_support,role.onboarding]
  const context = useContext(userContext)
  const ad_am = [role.admin, role.accounts_manager]
  const customer_edit_role = [role.admin, role.accounts_manager, role.accounts, role.billing, role.billing_manager]
  const transferAccess = u.is_roles(ad_am,context)
  const customer_access = u.is_roles(customer_edit_role,context)

  const variables = {
    cardcode: cardcode,
    ongoing: ongoing,
    delivered: delivered,
    invoiced: invoiced,
    recieved: recieved
  }

  const { loading, error, data } = useSubscription(
    CUSTOMER_DETAIL_SUBSCRIPTION,
    {
      variables: variables
    }
  )


  let _data = {}

  if (!loading) {
    _data = data
  }

  const customer_info = get(_data, 'customer[0]', { name: 'ID does not exist' })
  const ongoing_count = get(customer_info, 'ongoing.aggregate.count', 0)
  const delivered_count = get(customer_info, 'delivered.aggregate.count', 0)
  const invoiced_count = get(customer_info, 'invoiced.aggregate.count', 0)
  const recieved_count = get(customer_info, 'recieved.aggregate.count', 0)
  const incoming_count = get(customer_info, 'incoming.aggregate.count', 0)

  return (
    loading ? <Loading /> : (
      <Row>
        <Col xs={24}>
          <Card
            size='small'
            className='border-top-blue'
            title={
              <DetailPageHeader
                title={
                  <Space>
                    <CustomerName
                      cardcode={cardcode}
                      name={customer_info && customer_info.name}
                      loading={loading}
                      edit_access={customerNameEdit}
                    />
                    <h4>{cardcode}</h4>
                  </Space>
                }
                extra={
                  <Space>
                    {/* <div className='text-center'>
                      <Button
                        icon={<MailOutlined />}
                        shape='circle'
                        onClick={() => onShow('showModal')}
                      />
                      <p className='tinyAction'>Statement</p>
                    </div> */}
                        <Space>
                          { transferAccess ?
                          <div className='text-center'>
                            <Button
                              icon={<BankFilled />}
                              shape='circle'
                              onClick={() => onShow('transfer')}
                            />
                            <p className='tinyAction'>Transfer</p>
                          </div> :null }
                          {customerNameEdit
                      ? (
                          <div className='text-center'>
                            <Button
                              icon={<FileDoneOutlined />}
                              shape='circle'
                              onClick={() => onShow('rebate')}
                            />
                            <p className='tinyAction'>Excess</p>
                          </div>
                       )
                      : null}
                       </Space>
                    {customer_access ? (
                      <div className='text-center'>
                        <Button
                          shape='circle'
                          icon={<WalletOutlined />}
                          onClick={() => onShow('wallet')}
                        />
                        <p className='tinyAction'>Topup</p>
                      </div>)
                      : null}
                    <WalletBalance wallet_balance={get(customer_info, 'customer_accounting.wallet_balance', 0)} cardcode={cardcode} />
                    <Blacklist
                     customer_info={customer_info}
                      statusId={get(customer_info, 'status.id', null)}
                      edit_access={BlacklistEdit}
                    />
                  </Space>
                }
              />
            }
          >
            <CustomerInfo customer_info={customer_info} loading={loading} />
            <Row gutter={10} className='mt10'>
              <Col xs={24}>
                <Card size='small' className='card-body-0 border-top-blue'>
                  <Tabs defaultActiveKey='1'>
                    <TabPane
                      tab={<TitleWithCount name='On-going' value={ongoing_count} />}
                      key='1'
                    >
                      <CustomerTrips cardcode={cardcode} status_names={ongoing} />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Delivered' value={delivered_count} />}
                      key='2'
                    >
                      <CustomerTrips cardcode={cardcode} status_names={delivered} delivered />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Invoiced' value={invoiced_count} />}
                      key='3'
                    >
                      <CustomerTrips cardcode={cardcode} status_names={invoiced} />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Recieved' value={recieved_count} />}
                      key='4'
                    >
                      <CustomerClosedTrips cardcode={cardcode} />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Incoming' value={incoming_count} />}
                      key='5'
                    >
                      <IncomingPayments cardcode={cardcode} id={customer_info && customer_info.id} />
                    </TabPane>
                    <TabPane tab='Users' key='6'>
                      <Row justify='end' className='m5'>
                        {customer_access ? (
                          <Button type='primary' onClick={() => onShow('addUser')}>
                            <PlusOutlined /> Add Users
                          </Button>) : null}
                      </Row>
                      <Users cardcode={cardcode} customer_id={customer_info && customer_info.id} edit_access={customer_edit_role} />
                    </TabPane>
                    <TabPane tab='Branch' key='7'>
                      <Row justify='end' className='m5'>
                        {customer_access ? (
                          <Button
                            type='primary'
                            onClick={() => onShow('addBranch')}
                          >
                            <PlusOutlined /> Add Branch
                          </Button>) : null}
                      </Row>
                      <Branch cardcode={cardcode} edit_access={customer_edit_role} customer_id={customer_info && customer_info.id} />
                    </TabPane>
                    <TabPane tab='FR8 Branch' key='8'>
                      <Fr8Branch cardcode={cardcode} id={customer_info && customer_info.id} />
                    </TabPane>
                    <TabPane tab='Details' key='9'>
                      <Row className='p10'>
                        <Col xs={24} sm={24} md={12}>
                          <CustomerDetails customer_info={customer_info} loading={loading} />
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <PendingPayments customer_info={customer_info} />
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab='Comment' key='10'>
                      <div className='p10'>
                        <CustomerComment customer_id={customer_info.id} loading={loading} detailPage />
                      </div>
                    </TabPane>
                    <TabPane tab='Mamul Transfer' key='13' >
                         <TransferHistory cardcode={cardcode} loading={loading}/>
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
              {visible.addUser && (
                <CustomerUser visible={visible.addUser} onHide={onHide} customer={customer_info && customer_info.id} />
              )}
              {visible.addBranch && (
                <CustomerBranch visible={visible.addBranch} onHide={onHide} customer_id={customer_info && customer_info.id} />
              )}
              {visible.transfer && (
                <Transfer
                  visible={visible.transfer}
                  onHide={onHide}
                  cardcode={cardcode}
                  walletcode={customer_info && customer_info.walletcode}
                  customer_id={customer_info && customer_info.id}
                  wallet_balance={customer_info && customer_info.customer_accounting && customer_info.customer_accounting.wallet_balance}
                />
              )}
              {visible.rebate && (
                <Rebate
                  visible={visible.rebate}
                  onHide={onHide}
                  cardcode={cardcode}
                  walletcode={customer_info && customer_info.walletcode}
                  customer_id={customer_info && customer_info.id}
                  wallet_balance={customer_info && customer_info.customer_accounting && customer_info.customer_accounting.wallet_balance}
                />
              )}
              {visible.wallet && (
                <WalletTopup visible={visible.wallet} onHide={onHide} customer_id={customer_info && customer_info.id} />
              )}
              {visible.showModal && (
                <AccStmtMail visible={visible.showModal} onHide={onHide} />
              )}
            </Row>
          </Card>
        </Col>
      </Row>)
  )
}

export default CustomerDetailContainer
