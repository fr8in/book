import DownPayment from "../../components/payables/downPayment";
import ICICIBankOutgoing from "../../components/payables/iciciBankOutgoing";
import StmtEmail from "../payables/stmtMail";
import React, { useState } from "react";
const { Search } = Input;
const { RangePicker } = DatePicker;
import { Tabs, Row, Col, Card, Input, Button, DatePicker, Space } from "antd";
import PageLayout from "../../components/layout/pageLayout";
import { DownloadOutlined, MailTwoTone } from "@ant-design/icons";
import useShowHide from "../../hooks/useShowHide";

const TabPane = Tabs.TabPane;
const Branches = () => {
  const initial = { showModal: false };
  const { visible, onShow, onHide } = useShowHide(initial);
  const [dates, setDates] = useState([]);
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > 7;
    const tooEarly = dates[1] && dates[1].diff(current, "days") > 7;
    return tooEarly || tooLate;
  };
  return (
    <PageLayout title="Payables">
      <Card size="small" className="card-body-0 border-top-blue">
        <Tabs
          tabBarExtraContent={
            <Button
              title="Add Branch"
              size="small"
              type="primary"
              icon={<MailTwoTone />}
              onClick={() => onShow("showModal")}
            />
          }
        >
          <TabPane tab="Down Payment" key="1">
            <Row justify="end" className="m5">
              <Col flex="190px">
                <Search
                  size="small"
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
                  size="small"
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
                  size="small"
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
                  size="small"
                  placeholder="Search..."
                  onSearch={(value) => console.log(value)}
                  enterButton
                />
              </Col>
            </Row>

            <Row justify="start" className="m5">
              <Space>
                <Col flex="230px">
                  <RangePicker
                    size="small"
                    disabledDate={disabledDate}
                    onCalendarChange={(value) => {
                      setDates(value);
                    }}
                  />
                </Col>
                <Col>
                  <Button size="small">
                    <DownloadOutlined />
                  </Button>
                </Col>
              </Space>
            </Row>

            <ICICIBankOutgoing />
          </TabPane>
        </Tabs>
      </Card>
      {visible.showModal && (
        <StmtEmail
          visible={visible.showModal}
          onHide={() => onHide("showModal")}
        />
      )}
    </PageLayout>
  );
};

export default Branches;
