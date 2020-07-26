import { Row, Col, Card, Button, Space, Tabs, Tooltip } from 'antd'
import {
  BankFilled,
  FileDoneOutlined,
  WalletOutlined,
  PlusOutlined,
  MailOutlined,
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons'
import useShowHide from '../../../hooks/useShowHide'
// All components
import Loading from '../../common/loading'
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
import FinalPaymentsPending from '../finalPaymentPending'
import IncomingPayments from '../incomingPayments'
import AdvancePending from '../advancePending'
import InvoicePending from '../invoicePending'
import Users from '../users'
import Branch from '../branch'
import Fr8Branch from '../fr8Branch'
import CustomerUser from '../createCustomerUser'
import CustomerBranch from '../createCustomerBranch'
import Trips from '../../trips/trips'
import TitleWithCount from '../../common/titleWithCount'
// Apollo Client
import { useSubscription } from '@apollo/client'
import { CUSTOMER_DETAIL_SUBSCRIPTION } from './query/cutomerDetailSubscription'

const { TabPane } = Tabs

const CustomerDetailContainer = (props) => {
  const { cardcode } = props
  const initial = { transfer: false, rebate: false, wallet: false, addUser: false, addBranch: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const { loading, error, data } = useSubscription(
    CUSTOMER_DETAIL_SUBSCRIPTION,
    {
      variables: { cardcode }
    }
  )

  if (loading) return <Loading />
  console.log('CustomerDetailContainer Error', error)

  const { customer } = data
  const customerInfo = customer[0] ? customer[0] : { name: 'ID does not exist' }
  console.log('customerInfo', customerInfo)
  return (
    <Row>
      <Col xs={24}>
        <Card
          size='small'
          className='border-top-blue'
          title={
            <DetailPageHeader
              title={<CustomerName cardcode={customerInfo.cardcode} name={customerInfo.name} />}
              extra={
                <Space>
                  {!customerInfo.lrUrl
                    ? <Button shape='round' icon={<EyeOutlined />}>LR</Button>
                    : <Button type='primary' shape='round' icon={<UploadOutlined />}>LR</Button>}
                  <Tooltip title='Account Statement'>
                    <Button icon={<MailOutlined />} shape='circle' />
                  </Tooltip>
                  <Tooltip title='Transfer'>
                    <Button icon={<BankFilled />} shape='circle' onClick={() => onShow('transfer')} />
                  </Tooltip>
                  <Tooltip title='Rebate'>
                    <Button icon={<FileDoneOutlined />} shape='circle' onClick={() => onShow('rebate')} />
                  </Tooltip>
                  <Tooltip title='Wallet Topup'>
                    <Button shape='circle' icon={<WalletOutlined />} onClick={() => onShow('wallet')} />
                  </Tooltip>
                  <WalletBalance />
                  <Blacklist cardcode={customerInfo.cardcode} statusId={customerInfo.status && customerInfo.status.id} />
                </Space>
              }
            />
          }
        >
          <CustomerInfo customerInfo={customerInfo} />
          <Row gutter={10} className='mt10'>
            <Col xs={24}>
              <Card size='small' className='card-body-0 border-top-blue'>
                <Tabs defaultActiveKey='1'>
                  <TabPane tab={<TitleWithCount name='Final' value={35} />} key='1'>
                    <FinalPaymentsPending />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Incoming' value={29} />} key='2'>
                    <IncomingPayments />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Advance Pending(O)' value={3} />} key='3'>
                    <AdvancePending />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Advance Pending(C)' value={0} />} key='4'>
                    <AdvancePending />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Invoice Pending' value={2} />} key='5'>
                    <InvoicePending />
                  </TabPane>
                  <TabPane tab='Users' key='6'>
                    <Row justify='end' className='m5'>
                      <Button type='primary' onClick={() => onShow('addUser')}>
                        <PlusOutlined /> Add Users
                      </Button>
                    </Row>
                    <Users />
                  </TabPane>
                  <TabPane tab='Branch' key='7'>
                    <Row justify='end' className='m5'>
                      <Button type='primary' onClick={() => onShow('addBranch')}>
                        <PlusOutlined /> Add Branch
                      </Button>
                    </Row>
                    <Branch />
                  </TabPane>
                  <TabPane tab='FR8 Branch' key='8'>
                    <Fr8Branch />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Ongoing' value={3} />} key='9'>
                    <Trips />
                  </TabPane>
                  <TabPane tab={<TitleWithCount name='Completed' value={65} />} key='10'>
                    <Trips />
                  </TabPane>
                  <TabPane tab='Details' key='11'>
                    <Row>
                      <Col xs={24} sm={24} md={14}>
                        <CustomerDetails customerInfo={customerInfo} />
                      </Col>
                      <Col xs={24} sm={24} md={10}>
                        <Card size='small' className='card-body-0'>
                          <PendingPayments />
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
            {visible.addUser && <CustomerUser visible={visible.addUser} onHide={onHide} />}
            {visible.addBranch && <CustomerBranch visible={visible.addBranch} onHide={onHide} />}
            {visible.transfer && <Transfer visible={visible.transfer} onHide={onHide} />}
            {visible.rebate && <Rebate visible={visible.rebate} onHide={onHide} />}
            {visible.wallet && <WalletTopup visible={visible.wallet} onHide={onHide} />}
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default CustomerDetailContainer
