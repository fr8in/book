import { useState } from 'react'
import { Tabs, Card, Space, Button } from 'antd'
import PartnerLead from '../../partners/partnerLead'
import TruckVerification from '../../trucks/truckVerification'
import VasRequest from '../../partners/vasRequest'
import Breakdown from '../../trucks/breakdown'
import Announcenmemt from '../../partners/announcement'
import CreateLead from '../../partners/createLead'
import FilterList from '../../branches/employeeListFilter'
import TitleWithCount from '../../common/titleWithCount'
import useShowHide from '../../../hooks/useShowHide'
import { UserAddOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons'
import EmployeeList from '../../branches/fr8EmpolyeeList'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'


const SOURCING_QUERY = gql`
query($waiting_for_load_truck: truck_bool_exp, $breakdown_truck: truck_bool_exp){
partner_aggregate(where: {partner_status: {name: {_in: ["Lead","Registered"]}}}) {
  aggregate {
    count
  }
}
waiting_for_load: truck_aggregate(where: $waiting_for_load_truck) {
  aggregate {
    count
  }
}
breakdown: truck_aggregate(where: $breakdown_truck) {
  aggregate {
    count
  }
}
}
`
const TabPane = Tabs.TabPane
const SourcingContainer = () => {

  const aggrigation = {
    waiting_for_load_truck: {truck_status: {name: {_in: ['Waiting for load']
  }}},
  breakdown_truck: {truck_status: {name: {_in: ['Breakdown']
  }}}
  }

  const variables = {
    waiting_for_load_truck: aggrigation.waiting_for_load_truck,
    breakdown_truck: aggrigation.breakdown_truck
  }

  const [mainTabKey, setMainTabKey] = useState('1')
  const [subTabKey, setSubTabKey] = useState('1')
  const initial = { createLead: false, employeeList: false, filterList: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const waiting_for_load = ['Waiting for load']
  const breakdown = ["Breakdown"]
  const [truck_status, settruck_status] = useState(waiting_for_load)

  const { loading, error, data } = useQuery(
    SOURCING_QUERY, {
      variables:variables
    }
    
  )

  console.log('sourcingContainer Error', error)
  console.log('sourcingContainer Data', data)


  var _data = {}
  if (!loading) {
    _data = data
  }
 
  
  const lead_count = get(_data, 'partner_aggregate.aggregate.count', 0)
  const waiting_for_load_count = get(_data, 'waiting_for_load.aggregate.count', 0)
  const breakdown_count = get(_data, 'breakdown.aggregate.count', 0)

 console.log('lead_count',lead_count)
 

  const mainTabChange = (key) => {
    setMainTabKey(key)
    settruck_status
    switch (key) {
      case '3':
        settruck_status(waiting_for_load)
        break
      case '4':
        settruck_status(breakdown)
        break
      default:
        settruck_status(waiting_for_load)
        break
    }
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
                {subTabKey === '2' &&
                  <Space>
                    <Button type='primary' onClick={() => onShow('employeeList')}>Assign</Button>
                    <Button shape='circle' icon={<FilterOutlined />} onClick={() => onShow('filterList')} />
                    <Button type='primary' shape='circle' icon={<UserAddOutlined />} onClick={() => onShow('createLead')} />
                  </Space>}
              </span>
            }
          >
            <TabPane tab='Truck Verification' key='1'>
              <Card size='small' className='card-body-0'>
                <TruckVerification />
              </Card>
            </TabPane>
            <TabPane tab={<TitleWithCount name='Lead' value={lead_count} />} key='2'>
              <Card size='small' className='card-body-0'>
                <PartnerLead />
              </Card>
            </TabPane>
            <TabPane tab='Vas Request' key='3'>
              <Card size='small' className='card-body-0'>
                <VasRequest />
              </Card>
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane tab={<TitleWithCount name='Waiting for Load' value={waiting_for_load_count} />} key='3'>
          <Card size='small' className='card-body-0'>
            <Breakdown truck_status={waiting_for_load} loading={loading}/>
          </Card>
        </TabPane>
        <TabPane tab={<TitleWithCount name='Breakdown' value={breakdown_count} />} key='4'>
          <Card size='small' className='card-body-0'>
            <Breakdown truck_status={breakdown} loading={loading}/>
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