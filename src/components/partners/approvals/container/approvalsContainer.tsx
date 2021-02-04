import TransferToBankHistory from '../../../customers/transferToBankHistory'
import { Tabs, Card } from 'antd'
import Incentive from '../incentive'
import AdditionalAdvanceBankApproval from '../additionalAdvanceBank';
import CreditDebit from '../creditDebit'

const TabPane = Tabs.TabPane

const Approvals = () => {
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs>
      <TabPane tab='Credit' key='1'>
          <CreditDebit />
        </TabPane>
        <TabPane tab='Transfer to Bank' key='2'>
         <TransferToBankHistory />
        </TabPane>
        <TabPane tab='Incentive' key='3'>
          <Incentive />
        </TabPane> 
        <TabPane tab='Additional Advance Bank' key='4'>
          <AdditionalAdvanceBankApproval />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default Approvals
