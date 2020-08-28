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
import Users from '../users'
import Branch from '../branch'
import Fr8Branch from '../../customers/containers/fr8branchContainer'
import CustomerUser from '../createCustomerUser'
import CustomerBranch from '../createCustomerBranch'
import TitleWithCount from '../../common/titleWithCount'

// Apollo Client
import { useSubscription } from '@apollo/client'
import { CUSTOMER_DETAIL_SUBSCRIPTION } from './query/cutomerDetailSubscription'
import Loading from '../../common/loading'

const { TabPane } = Tabs

const ongoing = ['Assigned', 'Confirmed', 'Reported at source', 'Intransit', 'Reported at destination', 'Delivery onhold']
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

  console.log('CustomerDetailContainer Error', error)
  let customer_info = {}
  let ongoing_count = 0
  let delivered_count = 0
  let invoiced_count = 0
  let recieved_count = 0

  if (!loading) {
    const { customer } = data
    customer_info = customer && customer[0] ? customer[0] : { name: 'ID does not exist' }
    ongoing_count = get(customer_info, 'ongoing.aggregate.count', 0)
    delivered_count = get(customer_info, 'delivered.aggregate.count', 0)
    invoiced_count = get(customer_info, 'invoiced.aggregate.count', 0)
    recieved_count = get(customer_info, 'recieved.aggregate.count', 0)
  }

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
                      name={customer_info.name}
                      loading={loading}
                    />
                    <h4>{cardcode}</h4>
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
                      cardcode={cardcode}
                      statusId={customer_info.status && customer_info.status.id}
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
                      <CustomerTrips cardcode={cardcode} status_names={recieved} />
                    </TabPane>
                    <TabPane
                      tab={<TitleWithCount name='Incoming' value={0} />}
                      key='5'
                    >
                      <IncomingPayments />
                    </TabPane>
                    <TabPane tab='Users' key='6'>
                      <Row justify='end' className='m5'>
                        <Button type='primary' onClick={() => onShow('addUser')}>
                          <PlusOutlined /> Add Users
                        </Button>
                      </Row>
                      <Users
                        customeruser={customer_info.customer_users}
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
                        customerBranch={customer_info.customer_branches}
                        branch={customer_info.customer_branches && customer_info.customer_branches.id}
                        loading={loading}
                      />
                    </TabPane>
                    <TabPane tab='FR8 Branch' key='8'>
                      <Fr8Branch />
                    </TabPane>
                    <TabPane tab='Details' key='9'>
                      <Row className='p10'>
                        <Col xs={24} sm={24} md={12}>
                          <CustomerDetails customer_info={customer_info} loading={loading} />
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
                <CustomerUser visible={visible.addUser} onHide={onHide} customer={customer_info.id} />
              )}
              {visible.addBranch && (
                <CustomerBranch visible={visible.addBranch} onHide={onHide} customerbranch={customer_info.id} />
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
