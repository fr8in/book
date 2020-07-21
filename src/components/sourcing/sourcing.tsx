import PageLayout from "../../components/layout/pageLayout";
import { Tabs, Input, Row, Col, Space,Button } from "antd";
import PartnerKyc from '../../components/partners/partnerKyc'
import PartnerLead from '../../components/partners/partnerLead'
import TruckVerification from '../../components/trucks/truckVerrification'
import VasRequest from '../../components/partners/vasRequest'
import Breakdown from '../../components/trucks/breakdown'
import Announcenmemt from '../../components/partners/announcement'
import Customer from '../../components/customers/sourcingCus'
import CreateLead from '../partners/createLead'
import FilterList from '../branches/employeeListFilter'
import TitleWithCount from '../common/titleWithCount'
import useShowHide from '../../hooks/useShowHide'
import {UserAddOutlined,FilterOutlined} from '@ant-design/icons'
import EmployeeList from "../branches/fr8EmpolyeeList";
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}


const Sourcing = () => {
    const initial = {  createLead:false , employeeList:false , filterList:false}
  const { visible, onShow,onHide } = useShowHide(initial)
    return (
        <PageLayout title="Sourcing">
            <div className='card-body-0 border-top-blue'>
                <Tabs >
                    <TabPane tab="Partner" key="1">
                        <Tabs onChange={callback} type="card" className='card-body-0'
                            tabBarExtraContent={
                                <Space>
                                    <Button type="primary" onClick={() => onShow('employeeList')} > Assign </Button>
                                    <Button type="primary" icon={<FilterOutlined />} onClick={() => onShow('filterList')} />
                                    <Button type="primary" icon={<UserAddOutlined />} onClick={() => onShow('createLead')} />
                                </Space>
                            }
                        >
                             {visible.createLead && <CreateLead visible={visible.createLead} onHide={() => onHide('createLead')} />}
                             {visible.filterList && <FilterList visible={visible.filterList} onHide={() => onHide('filterList')} />}
                             {visible.employeeList && <EmployeeList visible={visible.employeeList} onHide={() => onHide('employeeList')} />}
                            <TabPane tab="KYC Verification" key="1" >
                                <Row gutter={8} justify='end' className='m5'>
                                    <Col span={3}>
                                        <Input placeholder="Search Partner Code or Name" />
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
                            <TabPane tab={<TitleWithCount name='Lead' value={120} />} key="3" >
                                <PartnerLead />
                            </TabPane>
                            <TabPane tab="Vas Request" key="4">
                                <VasRequest />
                            </TabPane>
                        </Tabs>
                    </TabPane>
                    <TabPane tab="Customer" key="2">
                        <Customer />
                    </TabPane>
                    <TabPane tab={<TitleWithCount name='Waiting for Load' value={671} />} key="3">
                        <Breakdown />
                    </TabPane>
                    <TabPane tab={<TitleWithCount name='Breakdown' value={65} />} key="4">
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

export default Sourcing;
