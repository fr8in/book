import { Collapse, Input, Row, Col, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import FasTag from "./cards/fasTag";
import FuelCard from "./cards/fuelCard";
const { Panel } = Collapse;

const { TabPane } = Tabs;
const PartnerDocument = () => {
  return (
    <Collapse accordion>
      <Panel header="Document" key="1">
        <div>
          <br />
          <Tabs type="card">
            <TabPane tab="Main" key="1">
              <div>
                <br />
                <Row>
                  <Col span={10}>
                    <label>
                      <h5> PAN </h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <UploadOutlined />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span={10}>
                    <label>
                      <h5>Card Number</h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <UploadOutlined />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span={10}>
                    <label>
                      <h5>Balance</h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <UploadOutlined />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span={10}>
                    <label>
                      <h5> Linked Mobile </h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <UploadOutlined />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span={10}>
                    <label>
                      <h5> Status </h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <UploadOutlined />
                  </Col>
                </Row>
                <br />
              </div>
            </TabPane>
            <TabPane tab="Sub Company" key="2">
              <div>
                <br />
                <Row>
                  <Col span={7}>
                    <label>
                      <h5> Name </h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <Input placeholder="Company Name" />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span={7}>
                    <label>
                      <h5>PAN</h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <Input placeholder="PAN Number" />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span={7}>
                    <label>
                      <h5>Cibil Score</h5>
                    </label>
                  </Col>
                  <Col span={10}>
                    <Input placeholder="Cibil Score" />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span={7}>
                    <label>
                      <h5> TDS </h5>
                    </label>
                  </Col>
                  <Col span={10}>1</Col>
                </Row>
                <br />
                <Row>
                  <Col span={7}>
                    <label>
                      <h5> Trucks </h5>
                    </label>
                  </Col>
                  <Col span={14}>
                    <Input placeholder="Add Trucks" disabled />
                  </Col>
                </Row>
                <br />
                <Row gutter={8} justify="end" className="m5">
                  <Col span={2}>
                    <Input placeholder="Save" disabled />
                  </Col>
                </Row>
                <br />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Panel>
      <Panel header="Fuel Detail" key="2">
        <FuelCard />
      </Panel>
      <Panel header="Fas Card" key="3">
        <span className="extra">
          <Input placeholder="Search..." style={{ width: "auto" }} />
        </span>

        <FasTag />
      </Panel>
    </Collapse>
  );
};

export default PartnerDocument;
