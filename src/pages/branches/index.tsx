import Branch from "../../components/branches/branches";
import Employees from "../../components/branches/employees";
import City from "../../components/branches/cityPricing";

import Link from "next/link";
import { Tabs, Row, Col, Card, Button } from "antd";
import PageLayout from "../../components/layout/pageLayout";
import { PlusCircleOutlined } from "@ant-design/icons";
const TabPane = Tabs.TabPane;
const Branches = () => {
  return (
    <PageLayout title="Branches">
      <Card size="small" className="card-body-0 border-top-blue">
        <Tabs>
          <TabPane tab="Branches" key="1">
            <Row justify="end" className="m5">
              <Col flex="130px">
                <Link href="cards/add-fuelcard">
                  <Button type="primary">
                    <PlusCircleOutlined />
                    Add Branch
                  </Button>
                </Link>
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
