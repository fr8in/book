import Branch from "../../components/branches/branches";
import Employees from "../../components/branches/employees";
import City from "../../components/branches/cityPricing";
import AddBranch from "../../pages/branches/addBranch";

import { Tabs, Row, Col, Card, Select } from "antd";
import PageLayout from "../../components/layout/pageLayout";

const TabPane = Tabs.TabPane;
const Branches = () => {
  return (
    <PageLayout title="Branches">
      <Card size="small" className="card-body-0 border-top-blue">
        <Tabs>
          <TabPane tab="Branches" key="1">
            <Row justify="end" className="m5">
              <Col flex="130px">
                <AddBranch />
              </Col>
            </Row>
            <Branch />
          </TabPane>
          <TabPane tab="Employess" key="2">
            <Employees />
          </TabPane>
          <TabPane tab="City Pricing" key="3">
            <City />
          </TabPane>
        </Tabs>
      </Card>
    </PageLayout>
  );
};

export default Branches;
