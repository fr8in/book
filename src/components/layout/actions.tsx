import { useState, useContext } from 'react'
import { Col, Button, Menu, Dropdown, Drawer, Space, Checkbox, Collapse, Typography } from 'antd'
import {
  UserOutlined,
  SearchOutlined,
  FilterFilled,
  BankFilled,
  LogoutOutlined
} from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import GlobalSearch from '../dashboard/globalSearch'
import { useQuery, gql } from '@apollo/client'
import { signOut } from '../../lib/auth'
import BankBalance from './bankBalance'
import u from '../../lib/util'
import isEmpty from 'lodash/isEmpty'
import userContext from '../../lib/userContaxt'
import moment from 'moment'
import get from 'lodash/get'
import filterContext from '../../lib/filterContaxt'
import { REGION_FILTER, BRANCHES_FILTER, CITIES_FILTER, MANAGER_FILTER, TRUCK_TYPE_FILTER} from '../../context/action'
import { useEffect } from 'react'


const { Panel } = Collapse
const CheckBoxGroup = Checkbox.Group
const { Text } = Typography

const GLOBAL_TRUCK_TYPE_FILTER = gql`
query global_truck_type_filter($now: timestamp, $regions: [Int!], $branches: [Int!], $cities: [Int!]) {
  truck_type(where: {active: {_eq: true}}) {
    id
    shortname
    trucks_type_total: trucks_aggregate(where: {truck_status: {name: {_eq: "Waiting for Load"}}, city: {connected_city: {branch_id: {_in: $branches}, branch: {region_id: {_in: $regions}}, id: {_in: $cities}}},partner: {partner_status: {name: {_eq: "Active"}}, dnd: {_neq: true}}}) {
      aggregate {
        count
      }
    }
    trucks_type_current: trucks_aggregate(where: {truck_status: {name: {_eq: "Waiting for Load"}}, available_at: {_lte: $now}, city: {connected_city: {branch_id: {_in: $branches}, branch: {region_id: {_in: $regions}}, id: {_in: $cities}}}, 
    partner: {partner_status: {name: {_eq: "Active"}}, dnd: {_neq: true}}}
    ) {
      aggregate {
        count
      }
    }
  }
}
`
const GLOBAL_FILTER = gql`
query gloabl_filter($now: timestamp, $regions: [Int!], $branches: [Int!], $cities: [Int!]) {
  region {
    id
    name
    branches(where: {_and: [{region_id: {_in: $regions}}, {id: {_in: $branches}}]}) {
      branch_employees {
        id
        employee {
          id
          name
        }
      }
      displayposition
      id
      name
      connected_cities: cities(where: {_and: [{is_connected_city: {_eq: true}}, {id: {_in: $cities}}]}) {
        id
        name
        cities {
          id
          name
          trucks_total: trucks_aggregate(where: {_and: [{truck_status: {name: {_eq: "Waiting for Load"}}}, 
             {partner: {partner_status: {name: {_eq: "Active"}}, dnd: {_neq: true}}} ]}) {
            aggregate {
              count
            }
          }
          trucks_current: trucks_aggregate(where: {_and: [{available_at: {_lte: $now}}, {truck_status: {name: {_eq: "Waiting for Load"}}}, 
            {partner: {partner_status: {name: {_eq: "Active"}}, dnd: {_neq: true}}}
          ]}) {
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
const Clear = (props) => <span className='clear' onClick={props.onClear}>CLEAR</span>

const Actions = (props) => {
  const { branch_ids } = props
  const initial = { filter: false, search: false, ssh: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [bank_visible, setBank_visible] = useState(false)

  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.rm, role.accounts_manager, role.billing_manager, role.partner_manager, role.accounts, role.billing, role.bm]
  const access = u.is_roles(edit_access, context)
  const {dispatch,state} = useContext(filterContext)
  
  const variables = {
    now: moment().format('YYYY-MM-DD'),
    regions: (state.regions && state.regions.length > 0) ? state.regions : null
  }
  const { loading, data, error } = useQuery(GLOBAL_FILTER, {
    variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })

  const truck_type_variables = {
    now: moment().format('YYYY-MM-DD'),
    regions: !isEmpty(state.regions) ? state.regions : null,
    branches: !isEmpty(state.branches) ? state.branches : null,
    cities: !isEmpty(state.cities) ? state.cities : null
  }

  const { loading:truck_type_loading, data:truck_type_data, error:truck_type_error } = useQuery(GLOBAL_TRUCK_TYPE_FILTER, {
    variables:truck_type_variables,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true
  })


  let region_options = []
  //2nd level branch_options 
  let branch_options = []
  //3rd level employee_options 
  let branch_employee_options = []
  //4th level connected_city_options
  let connected_city_options = []
  let truck_type_options = []

  if (!loading) {
    const { region } = data

    region.forEach(_region => {
      let _region_trucks_total = 0
      let _region_trucks_current = 0
      _region.branches.forEach(_branch => {
        let _branch_trucks_total = 0
        let _branch_trucks_current = 0
        _branch.branch_employees.forEach(_branch_employee => branch_employee_options.push({ label: _branch_employee && _branch_employee.employee && _branch_employee.employee.name, value: _branch_employee.id }))
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
          connected_city_options.push({ label: <span>{_connected_city.name + '    '}<Text disabled>{_connected_city_trucks_current + '/' + _connected_city_trucks_total}</Text></span>, value: _connected_city.id })
        })
        branch_options.push({ label: <span>{_branch.name + '    '}<Text disabled>{_branch_trucks_current + '/' + _branch_trucks_total}</Text></span>, value: _branch.id, order: _branch.displayposition })
      })
      region_options.push({ label: <span>{_region.name + '    '}<Text disabled>{_region_trucks_current + '/' + _region_trucks_total}</Text></span>, value: _region.id, })
    })
  }

   
  if (!truck_type_loading) {
    const { truck_type } = truck_type_data
    
    truck_type_options = !isEmpty(truck_type) ? truck_type.map(_truck_type => { 
      return (
        { 
          label: <span>{_truck_type.shortname + '    '}<Text disabled>{get(_truck_type, 'trucks_type_current.aggregate.count', 0) + '/' + get(_truck_type, 'trucks_type_total.aggregate.count', 0)}</Text></span>, 
          value: _truck_type.id 
        }
      )
     }) : []
  }


  const branch_options_sort = branch_options.sort((a, b) => a.order - b.order)

  useEffect(() => {
    dispatch({
      type: BRANCHES_FILTER,
      payload: state.branches && state.branches.length ? state.branches  : branch_ids
    })
     }, [props])

  const onCheckBoxChange = (value, name) => {
       dispatch({
      type: name,
      payload: value
    })
  };

 
  const onClear = (e, name) => {
    e.stopPropagation()
   dispatch({
    type: name,
    payload: null
  })
  };

  const onBankDetailToggle = (visible) => {
    setBank_visible(visible)
  }


  const user = (
    <Menu>
      <Menu.Item key='0'>
        <Button icon={<LogoutOutlined />} onClick={signOut}>Logout</Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <Col flex='auto' className='actions'>
      <Space>
        <Button size='small' type='ghost' shape='circle' icon={<FilterFilled />} onClick={() => onShow('filter')} />
        <Button size='small' type='ghost' shape='circle' icon={<SearchOutlined />} onClick={() => onShow('search')} />
        {access &&
          <Dropdown overlay={bank_visible ? <BankBalance /> : <Menu />} trigger={['click']} placement='bottomRight' onVisibleChange={onBankDetailToggle}>
            <Button size='small' type='ghost' shape='circle' icon={<BankFilled />} />
          </Dropdown>}
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
              extra={state.regions && state.regions.length > 0 ? <Clear onClear={(e) => onClear(e, REGION_FILTER)} /> : ''}
            >
              <CheckBoxGroup value={state.regions} options={region_options} onChange={(value) => onCheckBoxChange(value, REGION_FILTER)} />
            </Panel>
            <Panel
              header={<b>Branch</b>} key="branch"
              extra={state.branches && state.branches.length > 0 ? <Clear onClear={(e) => onClear(e, BRANCHES_FILTER)} /> : ''}
            >
              <CheckBoxGroup options={branch_options_sort} defaultValue={state.branches} value={state.branches} onChange={(value) => onCheckBoxChange(value,BRANCHES_FILTER)} />
            </Panel>
            <Panel
              header={<b>Type</b>} key="type"
              extra={state.types && state.types.length > 0 ? <Clear onClear={(e) => onClear(e, TRUCK_TYPE_FILTER)} /> : ''}
            >
              <CheckBoxGroup options={truck_type_options} value={state.types} onChange={(value) => onCheckBoxChange(value,TRUCK_TYPE_FILTER)} />
            </Panel>
            <Panel
              header={<b>City</b>} key="city"
              extra={state.cities && state.cities.length > 0 ? <Clear onClear={(e) => onClear(e, CITIES_FILTER)} /> : ''}
            >
              <CheckBoxGroup value={state.cities} options={connected_city_options} onChange={(value) => onCheckBoxChange(value,CITIES_FILTER)} />
            </Panel>
            <Panel
              header={<b>Manager</b>} key="manager"
              extra={state.managers && state.managers.length > 0 ? <Clear onClear={(e) => onClear(e, MANAGER_FILTER)} /> : ''}
            >
              <CheckBoxGroup options={branch_employee_options} defaultValue={state.managers} value={state.managers} onChange={(value) => onCheckBoxChange(value,MANAGER_FILTER)} />
            </Panel>
          </Collapse>
        </Drawer>}

      {visible.search &&
        <GlobalSearch visible={visible.search} onHide={onHide} />}
    </Col>
  )
}

export default Actions
