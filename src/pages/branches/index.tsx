import Branch from "../../components/branches/branches";
import Employees from "../../components/branches/employees";
import City from "../../components/branches/cityPricing";
import AddBranch from "../../pages/branches/addBranch";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Tabs, Row, Col, Card, Select, Button } from "antd";
import PageLayout from "../../components/layout/pageLayout";
import useShowHide from "../../hooks/useShowHide";

const TabPane = Tabs.TabPane;
const Branches = () => {
  const initial = { showModal: false };
  const { visible, onShow, onHide } = useShowHide(initial);
  return (
    <PageLayout title="Branches">
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
    </PageLayout>
  );
};

export default Branches;
