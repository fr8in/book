import { Tabs } from "antd";

import PageLayout from "../../components/layout/pageLayout";

const TabPane = Tabs.TabPane;

const sourcing = () => {
  return (
    <PageLayout title="Sourcing">
      <Tabs>
        <TabPane tab="Partner" key="1">
          Partner
        </TabPane>
        <TabPane tab="Customer" key="2">
          customer
        </TabPane>
        <TabPane tab="Approval Pending" key="3">
          Approval
        </TabPane>
        <TabPane tab="Waiting For Load" key="4">
          Waiting for Load
        </TabPane>
        <TabPane tab="Announcement" key="5">
          Announcement Waiting for Load
        </TabPane>
      </Tabs>
    </PageLayout>
  );
};

export default sourcing;
