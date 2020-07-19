import DownPayment from "../../components/payables/downPayment";
import ICICIBankOutgoing from "../../components/payables/iciciBankOutgoing";

const { Search } = Input;

import { Tabs, Row, Col, Card, Input, Calendar, Button } from "antd";
import PageLayout from "../../components/layout/pageLayout";
import { PlusCircleOutlined, MailTwoTone } from "@ant-design/icons";

function onPanelChange(value, mode) {
  console.log(value, mode);
}

const TabPane = Tabs.TabPane;
const Branches = () => {
  return (
    <PageLayout title="Payables">
      <Card size="small" className="card-body-0 border-top-blue">
        <Tabs
          tabBarExtraContent={<Button type="primary" icon={<MailTwoTone />} />}
        >
          <TabPane tab="Down Payment" key="1">
            <Row justify="end" className="m5">
              <Col flex="190px">
                <Search
                  placeholder="Search..."
                  onSearch={(value) => console.log(value)}
                  enterButton
                />
              </Col>
            </Row>
            <DownPayment />
          </TabPane>
          <TabPane tab="Outgoing" key="2">
            <Row justify="end" className="m5">
              <Col flex="190px">
                <Search
                  placeholder="Search..."
                  onSearch={(value) => console.log(value)}
                  enterButton
                />
              </Col>
            </Row>
            <DownPayment />
          </TabPane>
          <TabPane tab="Bank Transfer" key="3">
            <Row justify="end" className="m5">
              <Col flex="190px">
                <Search
                  placeholder="Search..."
                  onSearch={(value) => console.log(value)}
                  enterButton
                />
              </Col>
            </Row>
            <DownPayment />
          </TabPane>
          <TabPane tab="icici Bank Outgoing" key="4">
            <Row justify="end" className="m5">
              <Col flex="190px">
                <Search
                  placeholder="Search..."
                  onSearch={(value) => console.log(value)}
                  enterButton
                />
              </Col>
            </Row>
            <Row justify="start" className="m5">
              <Col flex="300px">
                <Calendar fullscreen={false} onPanelChange={onPanelChange} />
              </Col>
            </Row>
            <ICICIBankOutgoing />
          </TabPane>
        </Tabs>
      </Card>
    </PageLayout>
  );
};

export default Branches;
