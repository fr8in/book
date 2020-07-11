import { Tabs } from 'antd'
import CustomerList from './customerList'
import RejectedList from './rejectedList'
import NewCustomer from './newCustomer'

import PageLayout from '../../components/layout/PageLayout'

const TabPane = Tabs.TabPane

const Customers = () => {
  return (
    <PageLayout title='Customers'>
      <Tabs>
        <TabPane tab='Customers' key='1'>
          <CustomerList />
        </TabPane>
        <TabPane tab='Approval Pending' key='2'>
          <NewCustomer />
        </TabPane>
        <TabPane tab='Rejected' key='3'>
          <RejectedList />
        </TabPane>
      </Tabs>
    </PageLayout>
  )
}

export default Customers
