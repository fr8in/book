import { Row, Col, Card, Button, Space, Collapse } from 'antd'
import { BankFilled, LeftCircleFilled, WalletOutlined } from '@ant-design/icons'
import Blacklist from '../blacklist'
import CustomerInfo from '../customerInfo'
import { useQuery } from '@apollo/react-hooks'
import { CUSTOMER_INFO_QUERY } from './query/cutomerInfoQuery'
import CustomerName from '../customerName'
import useShowHide from '../../../hooks/useShowHide'
import Transfer from '../transfer'
import Rebate from '../rebate'
import WalletTopup from '../walletTopup'
import WalletBalance from '../walletBalance'
import PendingPayments from '../pendingPayments'

const { Panel } = Collapse

const CustomerDetailContainer = (props) => {
  const { cardCode } = props
  const initial = { transfer: false, rebate: false, wallet: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const { loading, error, data } = useQuery(
    CUSTOMER_INFO_QUERY,
    {
      variables: { cardCode },
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true
    }
  )

  if (loading) return <div>Loading...</div>
  const { customer } = data
  const customerInfo = customer[0] ? customer[0] : { name: 'ID does not exist' }

  return (
    <Card
      size='small'
      title={
        <CustomerName cardCode={customerInfo.cardCode} name={customerInfo.name} />
      }
      extra={<Blacklist cardCode={customerInfo.cardCode} statusId={customerInfo.statusId} />}
    >
      <Row gutter={[10, 10]}>
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
          <Card size='small' className='card-body-0 border-top-blue mt10'>
            <Collapse ghost accordion>
              <Panel header='Payments' key='1'>
                <PendingPayments />
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
      {visible.transfer && <Transfer visible={visible.transfer} onHide={() => onHide('transfer')} />}
      {visible.rebate && <Rebate visible={visible.rebate} onHide={() => onHide('rebate')} />}
      {visible.wallet && <WalletTopup visible={visible.wallet} onHide={() => onHide('wallet')} />}
    </Card>
  )
}

export default CustomerDetailContainer
