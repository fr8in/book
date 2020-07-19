import Branch from "../../components/branches/branches";
import Employees from "../../components/branches/employees";
import City from "../../components/branches/cityPricing";

import Link from "next/link";
import {
  Tabs,
  Row,
  Col,
  Card,
  Button,
  Popover,
  Input,
  Form,
  Select,
  Space,
} from "antd";
import PageLayout from "../../components/layout/pageLayout";
import { PlusCircleOutlined, LeftOutlined } from "@ant-design/icons";

const { Option } = Select;

const content = (
  <div>
    <Form.Item>
      <Input placeholder="Branch Name" />
    </Form.Item>
    <Form.Item>
      <Select placeholder="Branch Manager" allowClear>
        <Option value="Not Found">Not Found</Option>
      </Select>
    </Form.Item>
    <Form.Item>
      <Select placeholder="Traffic Coordinator" allowClear>
        <Option value="Not Found">Not Found</Option>
      </Select>
    </Form.Item>
    <Form.Item>
      <Input placeholder="Display Position" />
    </Form.Item>

    <Row justify="end" className="m5">
      <Space>
        <Button type="primary" size="small">
          <LeftOutlined />
          Back
        </Button>
        <Button type="primary" size="small">
          Save
        </Button>
      </Space>
    </Row>
  </div>
);

const TabPane = Tabs.TabPane;
const Branches = () => {
  return (
    <PageLayout title="Branches">
      <Card size="small" className="card-body-0 border-top-blue">
        <Tabs>
          <TabPane tab="Branches" key="1">
            <Row justify="end" className="m5">
              <Col flex="130px">
                <Popover content={content} title="Add Branch">
                  <Button type="primary">
                    <PlusCircleOutlined />
                    Add Branch
                  </Button>
                </Popover>
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
