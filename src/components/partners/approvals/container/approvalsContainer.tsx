import Pending from '../pending'
import Incentive from '../Incentive'
import Approved from '../approvedAndRejected'
import IncentiveHistory from '../incentiveHistory'
import { Tabs, Card } from 'antd'

const TabPane = Tabs.TabPane

const Approvals = () => {
  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Tabs>
        <TabPane tab='Pending' key='1'>
          <Pending />
        </TabPane>
        <TabPane tab='Approved/Rejected' key='2'>
          <Approved />
        </TabPane>
        <TabPane tab='Incentive' key='3'>
          <Incentive />
        </TabPane>
        <TabPane tab='History' key='4'>
          <IncentiveHistory />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default Approvals
