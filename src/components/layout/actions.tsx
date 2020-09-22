import { useState } from 'react'
import { Col, Button, Menu, Dropdown, Drawer, Space, Checkbox, Collapse, Typography } from 'antd'
import {
  UserOutlined,
  SearchOutlined,
  CodeOutlined,
  FilterFilled,
  BankFilled,
  LogoutOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import useShowHide from '../../hooks/useShowHide'
import GlobalSearch from '../dashboard/globalSearch'
import Ssh from '../dashboard/ssh'
import { useQuery, gql } from '@apollo/client'
import _ from 'lodash'
import React from "react";
import {signOut} from '../../lib/auth'


const { Panel } = Collapse
const CheckBoxGroup = Checkbox.Group
const { Text } = Typography

const GLOBAL_FILTER = gql`
query gloabl_filter($now: timestamptz, $regions:[Int!], $branches:[Int!], $cities:[Int!]) {
  truck_type {
    id
    name
  }
  region(where: {id: {_in: $regions}}) {
    id
    name
    branches(where:{_and: [ {region_id:{_in:$regions}} {id:{_in:$branches}}]}) {
      branch_employees {
        id
        employee {
          id
          name
        }
      }
      id
      name
      connected_cities: cities(where:{_and: [ {is_connected_city: {_eq: true}},{id:{_in:$cities}}]}) {
        id
        name
        cities {
          id
          name
          trucks_total: trucks_aggregate(where: {truck_status: {name: {_eq: "Waiting for Load"}}}) {
            aggregate {
              count
            }
          }
          trucks_current: trucks_aggregate(where: {_and: [{truck_status: {name: {_eq: "Waiting for Load"}}}, {available_at: {_gte: $now}}]}) {
            aggregate {
              count
            }
          }
        }
      }
    }
  }
}
`
const Clear =(props)=> <span className='clear' onClick={props.onClear}>CLEAR</span>

const Actions = (props) => {
  const { onFilter, initialFilter } = props
  const initial = { filter: false, search: false, ssh: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const [filter, setFilter] = useState(initialFilter)

  const variables = {
    now: initialFilter.now,
    regions: (filter.regions && filter.regions.length > 0) ? filter.regions : null
  }
  const { loading, data, error } = useQuery(GLOBAL_FILTER, { variables })

  console.log('Actions filter', filter, initialFilter)
  let region_options = []
  //2nd level branch_options 
  let branch_options = []
  //3rd level employee_options 
  let branch_employee_options = []
  //4th level connected_city_options 
  let connected_city_options = []
  let truck_type_options = []

  if (!loading) {
    truck_type_options = data && data.truck_type ? data.truck_type.map(_truck_type => { return { label: _truck_type.name, value: _truck_type.id } }) : []

    const { region } = data

    region.forEach(_region => {
      let _region_trucks_total = 0
      let _region_trucks_current = 0
      _region.branches.forEach(_branch => {
        let _branch_trucks_total = 0
        let _branch_trucks_current = 0
        _branch.branch_employees.forEach(_branch_employee => branch_employee_options.push({ label: _branch_employee.employee.name, value: _branch_employee.id }))
        _branch.connected_cities.forEach(_connected_city => {
          let _connected_city_trucks_total = 0
          let _connected_city_trucks_current = 0
          _connected_city.cities.forEach(_city => {
            _region_trucks_total = _region_trucks_total + _city.trucks_total?.aggregate.count
            _region_trucks_current = _region_trucks_current + _city.trucks_current?.aggregate.count
            _branch_trucks_total = _branch_trucks_total + _city.trucks_total?.aggregate.count
            _branch_trucks_current = _branch_trucks_current + _city.trucks_current?.aggregate.count
            _connected_city_trucks_total = _connected_city_trucks_total + _city.trucks_total?.aggregate.count
            _connected_city_trucks_current = _connected_city_trucks_current + _city.trucks_current?.aggregate.count
          })
          connected_city_options.push({ label: <span>{_connected_city.name + '    '}<Text disabled>{_connected_city_trucks_current + '/' + _connected_city_trucks_total}</Text></span>, value: _connected_city.id, })
        })
        branch_options.push({ label: <span>{_branch.name + '    '}<Text disabled>{_branch_trucks_current + '/' + _branch_trucks_total}</Text></span>, value: _branch.id, })
      })
      region_options.push({ label: <span>{_region.name + '    '}<Text disabled>{_region_trucks_current + '/' + _region_trucks_total}</Text></span>, value: _region.id, })
    })
  }

  const onCheckBoxChange = (value, name) => {
    setFilter({ ...filter, [name]: value })
    onFilter({ ...filter, [name]: value })
  };

  const onClear = (e, name) => {
    e.stopPropagation()
    setFilter({ ...filter, [name]: null })
    onFilter({ ...filter, [name]: null })
  };
  
 
  const user = (
    <Menu>
      <Menu.Item key='0'>
        <Button icon={<LogoutOutlined />} onClick={signOut}>Logout</Button>
        {/*<Link href='/login'><a><LogoutOutlined /> Logout</a></Link>*/}
      </Menu.Item>
    </Menu>
  )
  const account = (
    <Menu>
      <Menu.Item key='0'>ICICI <b>₹{'7,70,027'}</b></Menu.Item>
      <Menu.Item key='1'>YesBank <b>₹{'48266'}</b></Menu.Item>
      <Menu.Item key='2'>Reliance <b>₹{'1,87,694'}</b></Menu.Item>
    </Menu>
  )

  return (
    <Col flex='auto' className='actions'>
      <Space>
        <Button size='small' type='ghost' shape='circle' icon={<FilterFilled />} onClick={() => onShow('filter')} />
        <Button size='small' type='ghost' shape='circle' icon={<SearchOutlined />} onClick={() => onShow('search')} />
        <Dropdown overlay={account} trigger={['click']} placement='bottomRight'>
          <Button size='small' type='ghost' shape='circle' icon={<BankFilled />} />
        </Dropdown>
        {/* <Button size='small' type='ghost' shape='circle' icon={<CodeOutlined />} onClick={() => onShow('ssh')} /> */}
        <Dropdown overlay={user} trigger={['click']} placement='bottomRight'>
          <Button size='small' type='primary' shape='circle' icon={<UserOutlined />} />
        </Dropdown>
      </Space>

      {visible.filter &&
        <Drawer
          placement='right'
          closable={false}
          onClose={onHide}
          visible={visible.filter}
          bodyStyle={{ padding: 0 }}
        >
          <Collapse className='global-filter' defaultActiveKey={['branch']}>
            <Panel 
              header={<b>Region</b>} key='region' 
              extra={filter.regions && filter.regions.length > 0 ? <Clear onClear={(e) => onClear(e, 'regions')} /> : ''}
            >
              <CheckBoxGroup value={filter.regions} options={region_options} onChange={(value) => onCheckBoxChange(value, 'regions')} />
            </Panel>
            <Panel 
              header={<b>Branch</b>} key="branch" 
              extra={filter.branches && filter.branches.length > 0 ? <Clear onClear={(e) => onClear(e, 'branches')}/> : ''}
            >
              <CheckBoxGroup options={branch_options} value={filter.branches} onChange={(value) => onCheckBoxChange(value, 'branches')} />
            </Panel>
            <Panel 
              header={<b>City</b>} key="city" 
              extra={filter.cities && filter.cities.length > 0 ? <Clear onClear={(e) => onClear(e, 'cities')} /> : ''}
            >
              <CheckBoxGroup value={filter.cities} options={connected_city_options} onChange={(value) => onCheckBoxChange(value, 'cities')} />
            </Panel>
            <Panel 
              header={<b>Manager</b>} key="manager" 
              extra={filter.managers && filter.managers.length > 0 ? <Clear onClear={(e) => onClear(e, 'managers')} /> : ''}
            >
              <CheckBoxGroup options={branch_employee_options} value={filter.managers} onChange={(value) => onCheckBoxChange(value, 'managers')} />
            </Panel>
            <Panel 
              header={<b>Type</b>} key="type" 
              extra={filter.types && filter.types.length > 0 ? <Clear onClear={(e) => onClear(e, 'types')} /> : ''}
            >
              <CheckBoxGroup options={truck_type_options} value={filter.types} onChange={(value) => onCheckBoxChange(value, 'types')} />
            </Panel>
          </Collapse>
        </Drawer>}

      {visible.search &&
        <GlobalSearch visible={visible.search} onHide={onHide} />}

      {visible.ssh &&
        <Ssh visible={visible.ssh} onHide={onHide} />}
    </Col>
  )
}

export default Actions
