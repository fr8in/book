import Pending from "../pending";
import Approved from "../approvedAndRejected";
import { Tabs, Row, Col, Card, Input } from "antd";

const { Search } = Input;
const TabPane = Tabs.TabPane;
const Approvals = () => {
  return (
    <Card size="small" className="card-body-0 border-top-blue">
      <Tabs>
        <TabPane tab="Pending" key="1">
          <Pending />
        </TabPane>
        <TabPane tab="Approved/Rejected" key="2">
          <Row justify="end" className="m5">
            <Col flex="180px">
              <Search
                size="small"
                placeholder="Search Load Id or Request By"
                onSearch={(value) => console.log(value)}
                enterButton
              />
            </Col>
          </Row>
          <Approved />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Approvals;
