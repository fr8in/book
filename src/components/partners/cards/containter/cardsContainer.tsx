import Fastag from "../cardsFastag";
import FuelCard from "../cardsFuel";

import Link from "next/link";
import { Tabs, Row, Col, Card, Input, Button, Space } from "antd";

import { PlusCircleOutlined } from "@ant-design/icons";
const { Search } = Input;
const TabPane = Tabs.TabPane;
const cards = () => {
  return (
    <Card size="small" className="card-body-0 border-top-blue">
      <Tabs>
        <TabPane tab="Fuel Card" key="1">
          <Row justify="end" className="m5">
            <Space>
              <Link href="cards/add-fuelcard">
                <Button type="primary" size="small">
                  <PlusCircleOutlined />
                  Add Card
                </Button>
              </Link>

              <Button type="primary" size="small">
                Refresh Card List
              </Button>
            </Space>
          </Row>

          <FuelCard />
        </TabPane>
        <TabPane tab="FASTag" key="2">
          <Row justify="end" className="m5">
            <Space>
              <Search
                placeholder="Search..."
                size="small"
                onSearch={(value) => console.log(value)}
                enterButton
              />

              <Link href="cards/add-fastag">
                <Button type="primary" size="small">
                  <PlusCircleOutlined />
                  Add Tag
                </Button>
              </Link>
            </Space>
          </Row>
          <Fastag />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default cards;
