import Pending from '../pending'
import Approved from '../approvedAndRejected'
import TransferToBank from '../../../customers/transferToBank'
import TransferToBankHistory from '../../../customers/transferToBankHistory'
import { Tabs, Card } from 'antd'

const TabPane = Tabs.TabPane

const Approvals = () => {
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs>
        <TabPane tab='Credit' key='1'>
          <Pending />
        </TabPane>
        <TabPane tab='History' key='2'>
          <Approved />
        </TabPane>
        <TabPane tab='Transfer to Bank' key='3'>
          <TransferToBank />
        </TabPane>
        <TabPane tab='History' key='4'>
         <TransferToBankHistory />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default Approvals
