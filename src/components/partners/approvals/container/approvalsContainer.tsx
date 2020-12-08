import Pending from '../pending'
import Approved from '../approvedAndRejected'
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
      </Tabs>
    </Card>
  )
}

export default Approvals
