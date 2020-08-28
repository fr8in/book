import { Row, Col, Card, Button, Space, Tabs, Tooltip } from 'antd'
import get from 'lodash/get'
import {
  BankFilled,
  FileDoneOutlined,
  WalletOutlined,
  PlusOutlined,
  MailOutlined
} from '@ant-design/icons'
import useShowHide from '../../../hooks/useShowHide'
// All components
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
import IncomingPayments from '../incomingPayments'
import AdvancePending from '../advancePending'
import InvoicePending from '../invoicePending'
import Users from '../users'
import Branch from '../branch'
import Fr8Branch from '../fr8Branch'
import CustomerUser from '../createCustomerUser'
import CustomerBranch from '../createCustomerBranch'
import TitleWithCount from '../../common/titleWithCount'
import OngoingTrip from '../../trips/activeTrips'

// Apollo Client
import { useSubscription } from '@apollo/client'
import { CUSTOMER_DETAIL_SUBSCRIPTION } from './query/cutomerDetailSubscription'
import ClosedTripContainer from '../containers/closedtripContainer'
import Loading from '../../common/loading'

const { TabPane } = Tabs

const ongoing = ['Confirmed', 'Reported at source', 'Intransit', 'Reported at destination', 'Delivery onhold']
const invoicepending = ['Delivered', 'Approval Pending']
const final = ['Invoiced', 'Paid']
const closed = ['Recieved', 'Closed']
const advancepending_o = ['Confirmed', 'Reported at source', 'Intransit', 'Reported at destination', 'Delivery onhold']
const advancepending_c = ['Delivered', 'Approval Pending', 'Invoiced', 'Paid']

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

  const trip_variables = {
    cardcode: cardcode,
    closed: closed,
    ongoing: ongoing,
    invoicepending: invoicepending,
    final: final,
    advancepending_o: advancepending_o,
    advancepending_c: advancepending_c
  }

  const { loading, error, data } = useSubscription(
    CUSTOMER_DETAIL_SUBSCRIPTION,
    {
      variables: trip_variables
    }
  )

  console.log('CustomerDetailContainer Error', error)
  let customerInfo = {}
  let closed_count = 0
  let ongoing_count = 0
  let invoicepending_count = 0
  let final_count = 0
  let advancepending_count_o = 0
  let advancepending_count_c = 0

  if (!loading) {
    const { customer } = data
    customerInfo = customer[0] ? customer[0] : { name: 'ID does not exist' }
    closed_count = get(customerInfo, 'closed.aggregate.count', 0)
    ongoing_count = get(customerInfo, 'ongoing.aggregate.count', 0)
    invoicepending_count = get(customerInfo, 'invoicepending.aggregate.count', 0)
    final_count = get(customerInfo, 'final.aggregate.count', 0)
    advancepending_count_o = get(customerInfo, 'advancepending_o.aggregate.count', 0)
    advancepending_count_c = get(customerInfo, 'advancepending_c.aggregate.count', 0)
  }
  console.log('customerInfo', customerInfo)

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
                      cardcode={customerInfo.cardcode}
                      name={customerInfo.name}
                      loading={loading}
                    />
                    <h4>{customerInfo.cardcode}</h4>
                  </Space>
                }
                extra={
                  <Space>
                    <Tooltip title='Account Statement'>
                      <Button
                        icon={<MailOutlined />}
                        shape='circle'
                        onClick={() => onShow('showModal')}
                      />
                    </Tooltip>
                    <Tooltip title='Transfer'>
                      <Button
                        icon={<BankFilled />}
                        shape='circle'
                        onClick={() => onShow('transfer')}
                      />
                    </Tooltip>
                    <Tooltip title='Excess'>
                      <Button
                        icon={<FileDoneOutlined />}
                        shape='circle'
                        onClick={() => onShow('rebate')}
                      />
                    </Tooltip>
                    <Tooltip title='Wallet Topup'>
                      <Button
                        shape='circle'
                        icon={<WalletOutlined />}
                        onClick={() => onShow('wallet')}
                      />
                    </Tooltip>
                    <WalletBalance />
                    <Blacklist
                      cardcode={customerInfo.cardcode}
                      statusId={customerInfo.status && customerInfo.status.id}
                    />
                  </Space>
                }
              />
            }
          >
            <CustomerInfo customerInfo={customerInfo} loading={loading} />
            <Row gutter={10} className='mt10'>
              <Col xs={24}>
                <Card size='small' className='card-body-0 border-top-blue'>
                  <Tabs defaultActiveKey='1'>
                    <TabPane
                      tab={<TitleWithCount name='Final' value={final_count} />}
                      key='1'
                    >
                      <CustomerTrips cardcode={customerInfo.cardcode} status_names={final} />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Incoming' value={29} />}
                      key='2'
                    >
                      <IncomingPayments />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Advance Pending(O)' value={advancepending_count_o} />}
                      key='3'
                    >
                      <AdvancePending
                        advance_Pending={customerInfo.trips}
                        loading={loading}
                      />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Advance Pending(C)' value={advancepending_count_c} />}
                      key='4'
                    >
                      <AdvancePending
                        advance_pending={customerInfo.trips}
                        loading={loading}
                      />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Invoice Pending' value={invoicepending_count} />}
                      key='5'
                    >
                      <InvoicePending
                        invoice_Pending={customerInfo.trips}
                        loading={loading}
                      />
                    </TabPane>
                    <TabPane tab='Users' key='6'>
                      <Row justify='end' className='m5'>
                        <Button type='primary' onClick={() => onShow('addUser')}>
                          <PlusOutlined /> Add Users
                        </Button>
                      </Row>
                      <Users
                        customeruser={customerInfo.customer_users}
                        loading={loading}
                      />
                    </TabPane>
                    <TabPane tab='Branch' key='7'>
                      <Row justify='end' className='m5'>
                        <Button
                          type='primary'
                          onClick={() => onShow('addBranch')}
                        >
                          <PlusOutlined /> Add Branch
                        </Button>
                      </Row>
                      <Branch
                        customerBranch={customerInfo.customer_branches}
                        branch={customerInfo.customer_branches && customerInfo.customer_branches.id}
                        loading={loading}
                      />
                    </TabPane>
                    <TabPane tab='FR8 Branch' key='8'>
                      <Fr8Branch />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Ongoing' value={ongoing_count} />}
                      key='9'
                    >
                      <OngoingTrip trips={customerInfo.trips} loading={loading} />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Closed' value={closed_count} />}
                      key='10'
                    >
                      <ClosedTripContainer cardcode={cardcode} />
                    </TabPane>
                    <TabPane tab='Details' key='11'>
                      <Row className='p10'>
                        <Col xs={24} sm={24} md={12}>
                          <CustomerDetails customerInfo={customerInfo} loading={loading} />
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                          <PendingPayments />
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
              {visible.addUser && (
                <CustomerUser visible={visible.addUser} onHide={onHide} customer={customerInfo.id} />
              )}
              {visible.addBranch && (
                <CustomerBranch visible={visible.addBranch} onHide={onHide} customerbranch={customerInfo.id} />
              )}
              {visible.transfer && (
                <Transfer visible={visible.transfer} onHide={onHide} />
              )}
              {visible.rebate && (
                <Rebate visible={visible.rebate} onHide={onHide} />
              )}
              {visible.wallet && (
                <WalletTopup visible={visible.wallet} onHide={onHide} />
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
