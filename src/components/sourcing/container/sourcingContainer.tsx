import { useState, useContext } from 'react'
import { Tabs, Card, Space, Button } from 'antd'
import PartnerLead from '../../partners/partnerLead'
import TruckVerification from '../../trucks/truckVerification'
import Breakdown from '../../trucks/breakdown'
import Announcenmemt from '../../partners/announcement'
import CreateAnnouncenmemt from '../../partners/createannouncenment'
import CreateLead from '../../partners/createLead'
import FilterList from '../../branches/employeeListFilter'
import TitleWithCount from '../../common/titleWithCount'
import useShowHide from '../../../hooks/useShowHide'
import { UserAddOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../../lib/userContaxt'

const SOURCING_QUERY = gql`
query sourcing {
  partner_aggregate(where: {partner_status: {name: {_in: ["Lead", "Registered"]}}}) {
    aggregate {
      count
    }
  }
  waiting_for_load: truck_aggregate(where: {truck_status: {name: { _in: ["Waiting for Load"] }}}) {
    aggregate {
      count
    }
  }
}`

const TabPane = Tabs.TabPane
const SourcingContainer = () => {
  const context = useContext(userContext)
  const auth_user = [context.email]

  const [filter, setFilter] = useState(auth_user)
  const [mainTabKey, setMainTabKey] = useState('1')
  const [subTabKey, setSubTabKey] = useState('1')
  const initial = { createLead: false, employeeList: false, filterList: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const { loading, error, data } = useQuery(
    SOURCING_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    })

  console.log('sourcingContainer Error', error)

  var _data = {}
  if (!loading) {
    _data = data
  }

  const lead_count = get(_data, 'partner_aggregate.aggregate.count', 0)
  const waiting_for_load_count = get(_data, 'waiting_for_load.aggregate.count', 0)

  const onFilterChange = (checked) => {
    setFilter(checked)
  }
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
             {mainTabKey === '1' &&
                  <Space>
                    <Button type='primary' onClick={() => onShow('employeeList')}>Assign</Button>
                    <Button shape='circle' icon={<FilterOutlined />} onClick={() => onShow('filterList')} onChange={onFilterChange} />
                    <Button type='primary' shape='circle' icon={<UserAddOutlined />} onClick={() => onShow('createLead')} />
                  </Space>}
            {mainTabKey === '3' &&
              <Button shape='circle' icon={<FilterOutlined />} onClick={() => onShow('filterList')} />}
            {mainTabKey === '4' &&
              <Button shape='circle' type='primary' icon={<PlusOutlined />} onClick={() => onShow('createAnnouncenmemt')} />}
             
          </span>
        }
      >
            <TabPane tab={<TitleWithCount name='Lead' value={lead_count} />} key='1'>
              <Card size='small' className='card-body-0'>
                <PartnerLead visible={visible.employeeList} onHide={onHide} onboarded_by={filter} />
              </Card>
            </TabPane>
            
            
         
       
        <TabPane tab='Truck Verification' key='2'>
              <Card size='small' className='card-body-0'>
                <TruckVerification />
              </Card>
        </TabPane>
        <TabPane tab={<TitleWithCount name='Waiting for Load' value={waiting_for_load_count} />} key='3'>
          <Card size='small' className='card-body-0'>
            <Breakdown truck_status={['Waiting for Load']} loading={loading} visible={visible.employeeList} onHide={onHide} onboarded_by={filter} />
          </Card>
        </TabPane>
        <TabPane tab='Announcement' key='4'>
          <Card size='small' className='card-body-0'>
            <Announcenmemt />
          </Card>
        </TabPane>
      </Tabs>
      {visible.createLead && <CreateLead visible={visible.createLead} onHide={onHide} />}
      {visible.filterList && <FilterList visible={visible.filterList} onHide={onHide} onFilterChange={onFilterChange} onboarded_by={filter} />}
      {visible.createAnnouncenmemt && <CreateAnnouncenmemt visible={visible.createAnnouncenmemt} onHide={onHide} />}
    </Card>
  )
}

export default SourcingContainer
