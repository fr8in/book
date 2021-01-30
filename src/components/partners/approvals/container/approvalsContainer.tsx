import Pending from '../pending'
import Approved from '../approvedAndRejected'
import TransferToBankHistory from '../../../customers/transferToBankHistory'
import { Tabs, Card } from 'antd'
import Incentive from '../incentive'
import AdditionalAdvanceBankApproval from '../additionalAdvanceBank';

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
         <TransferToBankHistory />
        </TabPane>
        <TabPane tab='Incentive' key='4'>
          <Incentive />
        </TabPane> 
        <TabPane tab='Additional Advance Bank' key='5'>
          <AdditionalAdvanceBankApproval />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default Approvals
