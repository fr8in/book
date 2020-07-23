import Branch from "../branches";
import Employees from "../employees";
import City from "../cityPricing";
import AddBranch from "../addBranch";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Tabs, Row, Col, Card, Select, Button } from "antd";

import useShowHide from "../../../hooks/useShowHide";

const TabPane = Tabs.TabPane;
const Branches = () => {
  const initial = { showModal: false };
  const { visible, onShow, onHide } = useShowHide(initial);
  return (
    <div>
      <Card size="small" className="card-body-0 border-top-blue">
        <Tabs>
          <TabPane tab="Branches" key="1">
            <Row justify="end" className="m5">
              <Col flex="130px">
                <Button
                  title="Add Branch"
                  size="small"
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => onShow("showModal")}
                >
                  Add Branch
                </Button>
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
      {visible.showModal && (
        <AddBranch
          visible={visible.showModal}
          onHide={() => onHide("showModal")}
        />
      )}
    </div>
  );
};

export default Branches;
