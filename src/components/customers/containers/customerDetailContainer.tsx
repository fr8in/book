import { Row, Col, Card, Button, Space, Collapse, Tabs } from 'antd'
import { BankFilled, LeftCircleFilled, WalletOutlined, PlusOutlined } from '@ant-design/icons'
import useShowHide from '../../../hooks/useShowHide'
// All components
import Loading from '../../common/loading'
import CustomerName from '../customerName'
import Blacklist from '../blacklist'
import CustomerInfo from '../customerInfo'
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
// Apollo Client
import { useSubscription } from '@apollo/client'
import { CUSTOMER_DETAIL_SUBSCRIPTION } from './query/cutomerDetailSubscription'

const { Panel } = Collapse
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

  return (
    <Row>
      <Col xs={24}>
        <Row className='mb10'>
          <Col xs={24}>
            <Card
              size='small'
              className='border-top-blue'
              title={
                <CustomerName cardcode={customerInfo.cardcode} name={customerInfo.name} />
              }
              extra={<Blacklist cardcode={customerInfo.cardcode} statusId={customerInfo.status_id} />}
            >
              <Row gutter={10}>
                <Col xs={24} sm={24} md={14}>
                  <CustomerInfo customerInfo={customerInfo} />
                </Col>
                <Col xs={24} sm={24} md={10}>
                  <Row justify='space-between'>
                    <Space>
                      <Button icon={<BankFilled />} onClick={() => onShow('transfer')}>
                    Transfer
                      </Button>
                      <Button icon={<LeftCircleFilled />} onClick={() => onShow('rebate')}>
                    Rebate
                      </Button>
                    </Space>
                    <Space>
                      <WalletBalance />
                      <Button type='primary' shape='circle' icon={<WalletOutlined />} onClick={() => onShow('wallet')} />
                    </Space>
                  </Row>
                  <Card size='small' className='card-body-0 mt10'>
                    <Collapse ghost accordion>
                      <Panel header='Payments' key='1'>
                        <PendingPayments />
                      </Panel>
                    </Collapse>
                  </Card>
                </Col>
                {visible.transfer && <Transfer visible={visible.transfer} onHide={onHide} />}
                {visible.rebate && <Rebate visible={visible.rebate} onHide={onHide} />}
                {visible.wallet && <WalletTopup visible={visible.wallet} onHide={onHide} />}
              </Row>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Card size='small' className='card-body-0 border-top-blue'>
              <Tabs defaultActiveKey='1'>
                <TabPane tab='Final' key='1'>
                  <FinalPaymentsPending />
                </TabPane>
                <TabPane tab='Incoming' key='2'>
                  <IncomingPayments />
                </TabPane>
                <TabPane tab='Advance Pending(O)' key='3'>
                  <AdvancePending />
                </TabPane>
                <TabPane tab='Advance Pending (C)' key='4'>
                  <AdvancePending />
                </TabPane>
                <TabPane tab='Invoice Pending' key='5'>
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
                <TabPane tab='Ongoing' key='9'>
                  <Trips />
                </TabPane>
                <TabPane tab='Completed' key='10'>
                  <Trips />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          {visible.addUser && <CustomerUser visible={visible.addUser} onHide={onHide} />}
          {visible.addBranch && <CustomerBranch visible={visible.addBranch} onHide={onHide} />}
        </Row>
      </Col>
    </Row>
  )
}

export default CustomerDetailContainer
