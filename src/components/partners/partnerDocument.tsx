import { Collapse, Input, Row, Col, Tabs, Button, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import LabelWithData from "../common/labelWithData";
import FasTag from "../../components/partners/cards/fasTag";
import FuelCard from "../../components/partners/cards/fuelCard";
const { Panel } = Collapse;

const { TabPane } = Tabs;
const PartnerDocument = () => {
  return (
    <Collapse accordion>
      <Panel header="Document" key="1"> 
        <br />
        <Tabs type="card">
          <TabPane tab="Main" key="1">
            <br />
            <Row gutter={8}>
              <Col xs={24} sm={24} md={24}>
                <LabelWithData
                  label="PAN"
                  data={
                    <Space>
                      <span>                      
                        <Button size="middle">
                          <UploadOutlined />
                        </Button>
                      </span>
                    </Space>
                  }
                  labelSpan={10}
                  dataSpan={14}
                />
                <LabelWithData
                  label="Card Number"
                  data={
                    <Space>
                      <span>                      
                        <Button>
                          <UploadOutlined />
                        </Button>
                      </span>
                    </Space>
                  }
                  labelSpan={10}
                  dataSpan={14}
                />
                <LabelWithData
                  label="Balance"
                  data={
                    <Space>
                      <span>
                       
                        <Button>
                          <UploadOutlined />
                        </Button>
                      </span>
                    </Space>
                  }
                  labelSpan={10}
                  dataSpan={14}
                />
                <LabelWithData
                  label=" Linked Mobile "
                  data={
                    <Space>
                      <span>                      
                        <Button>
                          <UploadOutlined />
                        </Button>
                      </span>
                    </Space>
                  }
                  labelSpan={10}
                  dataSpan={14}
                />

                <LabelWithData
                  label="Status"
                  data={
                    <Space>
                      <span>
                        <Button>
                          <UploadOutlined />
                        </Button>
                      </span>
                    </Space>
                  }
                  labelSpan={10}
                  dataSpan={14}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Sub Company" key="2">
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
          </TabPane>
        </Tabs>
      </Panel>
      <Panel header="Fuel Detail" key="2">
        <br />
        <FuelCard />
        <br />
      </Panel>
      <Panel header="Fas Card" key="3">
        <Row justify="end" className="m5">
          <span className="extra">
            <Input placeholder="Search..." style={{ width: "auto" }} />
          </span>
        </Row>
        <br />
        <FasTag />
      </Panel>
    </Collapse>
  );
};

export default PartnerDocument;
