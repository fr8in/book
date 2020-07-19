import PageLayout from "../../components/layout/pageLayout";
import { Tabs, Input, Row, Col, Button, Space } from "antd";
import { UserAddOutlined, FilterOutlined, WhatsAppOutlined, CarOutlined } from '@ant-design/icons'
import PartnerKyc from '../../components/partners/partnerKyc'
import PartnerLead from '../../components/partners/partnerLead'
import TruckVerification from '../../components/trucks/truckVerrification'
import VasRequest from '../../components/partners/vasRequest'
import Breakdown from '../../components/trucks/breakdown'
import Announcenmemt from '../../components/partners/announcement'
import Customer from '../../components/customers/sourcingCus'
const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}


const sourcing = () => {
  return (
    <PageLayout title="Sourcing">
      <div className='card-body-0 border-top-blue'>
        <Tabs>
          <TabPane tab="Partner" key="1">
            <Tabs onChange={callback} type="card" className='card-body-0'
               tabBarExtraContent={
                <Space>
                  <Button type="primary"> Assign </Button>
                  <Button type="primary" icon={<FilterOutlined />} />
                  <Button type="primary" icon={<UserAddOutlined />} />
                </Space>
              }
            >
              <TabPane tab="KYC Verification" key="1" >
                <Row gutter={8} justify='end' className='m5'>
                  <Col span={3}>
                    <Input placeholder="Search Partner Codeor Name" />
                  </Col>
                </Row>
                <PartnerKyc />
              </TabPane>
              <TabPane tab="Truck Verification" key="2">
                <Row gutter={8} justify='end' className='m5'>
                  <Col span={3}>
                    <Input placeholder="Search..." />
                  </Col>
                </Row>
                < TruckVerification />
              </TabPane>
              <TabPane tab="Lead" key="3" >
                
                <PartnerLead />
              </TabPane>
              <TabPane tab="Vas Request" key="4">
                <VasRequest />
              </TabPane>
            </Tabs>,
        </TabPane>

          <TabPane tab="Customer" key="2">
            <Customer />
          </TabPane>
          <TabPane tab="Waiting For Load" key="3">
            <Breakdown />
          </TabPane>
          <TabPane tab="Breakdown" key="4">
            <Breakdown />
          </TabPane>
          <TabPane tab="Announcement" key="5">
            <Announcenmemt />
          </TabPane>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default sourcing;
