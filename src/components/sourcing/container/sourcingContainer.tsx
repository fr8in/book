import { useState } from 'react'
import { Tabs, Card, Space, Button } from 'antd'
import PartnerKyc from '../../partners/partnerKyc'
import PartnerLead from '../../partners/partnerLead'
import TruckVerification from '../../trucks/truckVerification'
import VasRequest from '../../partners/vasRequest'
import Breakdown from '../../trucks/breakdown'
import Announcenmemt from '../../partners/announcement'
import CustomerLead from '../../customers/customerLead'
import CreateLead from '../../partners/createLead'
import FilterList from '../../branches/employeeListFilter'
import TitleWithCount from '../../common/titleWithCount'
import useShowHide from '../../../hooks/useShowHide'
import { UserAddOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons'
import EmployeeList from '../../branches/fr8EmpolyeeList'

const TabPane = Tabs.TabPane

const SourcingContainer = () => {
  const [mainTabKey, setMainTabKey] = useState('1')
  const [subTabKey, setSubTabKey] = useState('1')
  const initial = { createLead: false, employeeList: false, filterList: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const mainTabChange = (key) => {
    setMainTabKey(key)
  }
  const subTabChange = (key) => {
    setSubTabKey(key)
  }
  return (
    <Card size='small' className='border-top-blue card-pt0'>
      <Tabs
        onChange={mainTabChange}
        tabBarExtraContent={
          <span>
            {mainTabKey === '2' &&
              <Space>
                <Button type='primary' onClick={() => onShow('employeeList')}>Assign</Button>
                <Button shape='circle' icon={<FilterOutlined />} onClick={() => onShow('filterList')} />
                <Button type='primary' shape='circle' icon={<UserAddOutlined />} onClick={() => onShow('createLead')} />
              </Space>}
            {(mainTabKey === '3' || mainTabKey === '4') &&
              <Button shape='circle' icon={<FilterOutlined />} onClick={() => onShow('filterList')} />}
            {mainTabKey === '5' &&
              <Button shape='circle' type='primary' icon={<PlusOutlined />} onClick={() => onShow('filterList')} />}
          </span>
        }
      >
        <TabPane tab='Partner' key='1'>
          <Tabs
            onChange={subTabChange} type='card'
            tabBarExtraContent={
              <span>
                {subTabKey === '3' &&
                  <Space>
                    <Button type='primary' onClick={() => onShow('employeeList')}>Assign</Button>
                    <Button shape='circle' icon={<FilterOutlined />} onClick={() => onShow('filterList')} />
                    <Button type='primary' shape='circle' icon={<UserAddOutlined />} onClick={() => onShow('createLead')} />
                  </Space>}
              </span>
            }
          >
            <TabPane tab='KYC Verification' key='1'>
              <Card size='small' className='card-body-0'>
                <PartnerKyc />
              </Card>
            </TabPane>
            <TabPane tab='Truck Verification' key='2'>
              <Card size='small' className='card-body-0'>
                <TruckVerification />
              </Card>
            </TabPane>
            <TabPane tab={<TitleWithCount name='Lead' value={120} />} key='3'>
              <Card size='small' className='card-body-0'>
                <PartnerLead />
              </Card>
            </TabPane>
            <TabPane tab='Vas Request' key='4'>
              <Card size='small' className='card-body-0'>
                <VasRequest />
              </Card>
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane tab='Customer' key='2'>
          <Card size='small' className='card-body-0'>
            <CustomerLead />
          </Card>
        </TabPane>
        <TabPane tab={<TitleWithCount name='Waiting for Load' value={671} />} key='3'>
          <Card size='small' className='card-body-0'>
            <Breakdown />
          </Card>
        </TabPane>
        <TabPane tab={<TitleWithCount name='Breakdown' value={65} />} key='4'>
          <Card size='small' className='card-body-0'>
            <Breakdown />
          </Card>
        </TabPane>
        <TabPane tab='Announcement' key='5'>
          <Card size='small' className='card-body-0'>
            <Announcenmemt />
          </Card>
        </TabPane>
      </Tabs>
      {visible.createLead && <CreateLead visible={visible.createLead} onHide={onHide} />}
      {visible.filterList && <FilterList visible={visible.filterList} onHide={onHide} />}
      {visible.employeeList && <EmployeeList visible={visible.employeeList} onHide={onHide} />}
    </Card>
  )
}

export default SourcingContainer
