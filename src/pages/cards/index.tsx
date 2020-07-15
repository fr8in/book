import Fastag from "../../components/cards/cardsFastag";
import FuelCard from "../../components/cards/cardsFuel";

import Link from "next/link";
import { Tabs, Row, Col, Card, Input, Button } from "antd";
import PageLayout from "../../components/layout/pageLayout";
import { PlusCircleOutlined } from "@ant-design/icons";
const { Search } = Input;
const TabPane = Tabs.TabPane;
const cards = () => {
  return (
    <PageLayout title="Approval">
      <Card size="small" className="card-body-0 border-top-blue">
        <Tabs>
          <TabPane tab="Fuel Card" key="1">
            <Row justify="end" className="m5">
              <Col flex="130px"></Col>
              <Col flex="180px">
                <Button type="primary">Refresh Card List</Button>
              </Col>
            </Row>
            <FuelCard />
          </TabPane>
          <TabPane tab="FASTag" key="2">
            <Row justify="end" className="m5">
              <Col flex="130px">
                <Search
                  placeholder="Search..."
                  onSearch={(value) => console.log(value)}
                  enterButton
                />
              </Col>
              <Col flex="180px">
                <Link href="cards/addFuelCard">
                  <Button type="primary">
                    <PlusCircleOutlined />
                    Add Tag
                  </Button>
                </Link>
              </Col>
            </Row>
            <Fastag />
          </TabPane>
        </Tabs>
      </Card>
    </PageLayout>
  );
};

export default cards;
