import { useState } from 'react'
import { Col, Button, Menu, Dropdown, Drawer, Modal, Input, Checkbox, Collapse } from 'antd'
import {
  UserOutlined,
  SearchOutlined,
  CodeOutlined,
  FilterFilled,
  BankFilled,
  LogoutOutlined,
  UnlockOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import useShowHide from '../../hooks/useShowHide'
import filterData from '../../../mock/globalFilter/filterData'
import filterGroup from '../../../mock/globalFilter/filterGroup'

const { Panel } = Collapse
const CheckBoxGroup = Checkbox.Group

const Actions = () => {
  const initial = { filter: false, search: false, ssh: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [globalException, setGlobalException] = useState(false)

  const user = (
    <Menu>
      <Menu.Item key='0'>
        <Link href='/login'><a><LogoutOutlined /> Logout</a></Link>
      </Menu.Item>
    </Menu>
  )
  const account = (
    <Menu>
      <Menu.Item key='0'>ICICI <span>₹{'7,70,027'}</span></Menu.Item>
      <Menu.Item key='1'>YesBank <span>₹{'48266'}</span></Menu.Item>
      <Menu.Item key='2'>Reliance <span>₹{'1,87,694'}</span></Menu.Item>
    </Menu>
  )
  const handleSubmit = () => {
    console.log('SSH access clicked!')
  }
  const callBack = () => {
    console.log('callback clicked')
  }
  const changeExeceptionStatus = () => {
    setGlobalException(prev => !prev)
  }
  const getFiltersList = (data) => {
    return data && data.length > 0 ? data.map(t => {
      return {
        label: <span>{t.filtername}{t.groupId !== 8 && <span className='filterCount'>{t.positiveTatCount + '/' + t.count}</span>}</span>,
        value: t.filterId,
        groupId: t.groupId
      }
    }) : []
  }

  return (
    <Col xs={20} className='actions'>
      <Button size='small' type='ghost' shape='circle' icon={<FilterFilled />} onClick={() => onShow('filter')} />
      <Button size='small' type='ghost' shape='circle' icon={<SearchOutlined />} onClick={() => onShow('search')} />
      <Dropdown overlay={account} trigger={['click']} placement='bottomRight'>
        <Button size='small' type='ghost' shape='circle' icon={<BankFilled />} />
      </Dropdown>
      <Button size='small' type='ghost' shape='circle' icon={<CodeOutlined />} onClick={() => onShow('ssh')} />
      <Dropdown overlay={user} trigger={['click']} placement='bottomRight'>
        <Button size='small' type='primary' shape='circle' icon={<UserOutlined />} />
      </Dropdown>

      <Drawer
        placement='right'
        closable={false}
        onClose={() => onHide('filter')}
        visible={visible.filter}
      >
        <div>
          <Checkbox name='Exception' onChange={changeExeceptionStatus} defaultChecked={globalException === true}>
            Exception
          </Checkbox>
        </div>
        <Collapse defaultActiveKey={['1']} onChange={callBack} className='global-filter'>
          {filterData && filterData.length > 0 ? filterData.map(data => {
            const nonZeroList = data.groupList && data.groupList.length > 0 ? data.groupList.filter(t => t.count > 0) : []
            const zeroList = data.groupList && data.groupList.length > 0 ? data.groupList : []
            const filtersList = getFiltersList(data.groupId === 2 || data.groupId === 7 ? nonZeroList : zeroList)
            return (
              <Panel
                header={<span><b>{data.groupName}</b></span>}
                key={data.groupId}
                extra={<span className='clear' onClick={(e) => e.stopPropagation()}>CLEAR</span>}
              >
                <ul className='filterMenu'>
                  <li>
                    {filtersList &&
                      <CheckBoxGroup
                        options={filtersList}
                        onChange={callBack}
                        value={data.groupId === 1 ? filterGroup[0].customerManagerFilter.filterId
                          : data.groupId === 2 ? filterGroup[1].connectedCitiesFilter.filterId
                            : data.groupId === 3 ? filterGroup[2].laneManagerFilter.filterId
                              : data.groupId === 4 ? filterGroup[3].partnerFilter.filterId
                                : data.groupId === 5 ? filterGroup[4].orderFilter.filterId
                                  : data.groupId === 6 ? filterGroup[5].truckTypeFilter.filterId
                                    : data.groupId === 7 ? filterGroup[6].truckLaneFilter.filterId
                                      : filterGroup[7].trafficManager.filterId}
                      />}
                  </li>
                </ul>
              </Panel>
            )
          }) : []}
        </Collapse>
      </Drawer>
      <Drawer
        title={<Input placeholder='Search...' prefix={<SearchOutlined />} />}
        placement='right'
        closable={false}
        onClose={() => onHide('search')}
        visible={visible.search}
      >
        <p>Search contents...</p>
      </Drawer>
      <Modal
        title='SSH Access'
        visible={visible.ssh}
        onOk={handleSubmit}
        onCancel={() => onHide('ssh')}
      >
        <Input placeholder='Enter your IPV4' prefix={<UnlockOutlined />} />
      </Modal>
    </Col>
  )
}

export default Actions
