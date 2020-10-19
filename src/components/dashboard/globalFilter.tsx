import { Row, Checkbox, Collapse, Typography, Spin } from 'antd'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react'
const { Panel } = Collapse
const CheckBoxGroup = Checkbox.Group
const { Text } = Typography;
import _ from 'lodash'

const GLOBAL_FILTER = gql`
query gloabl_filter($now: timestamp, $regions:[Int!], $branches:[Int!], $cities:[Int!]) {
  truck_type {
    id
    name
  }
  region {
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
          trucks_total: trucks_aggregate(where: {
            _and: [
                {truck_status: {name: {_eq: "Waiting for Load"}}}, 
                {partner:{partner_status:{name:{_eq:"Active"}}}}
              ],
            _or:[{ partner:{dnd:{_neq:true}}}, {truck_type: {id:{_nin: [25,27]}}}]
          }) {
            aggregate {
              count
            }
          }
          trucks_current: trucks_aggregate(where: {
            _and: [
                {available_at: {_gte: $now}},
                {truck_status: {name: {_eq: "Waiting for Load"}}}, 
                {partner:{partner_status:{name:{_eq:"Active"}}}}
              ],
            _or:[{ partner:{dnd:{_neq:true}}}, {truck_type: {id:{_nin: [25,27]}}}]
            }) {
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

let region_options = []
//2nd level branch_options 
let branch_options = []
//3rd level employee_options 
let branch_employee_options = []
//4th level connected_city_options 
let connected_city_options = []
let truck_type_options = []

const GlobalFilter = ({onFilter,initialFilter}) => {
  const [filter, setFilter] = useState(initialFilter)
  // const [activeKey, setActiveyKey] = useState(['branch']);
 
  const onRegionChange = (regions) => {
    setFilter({ ...filter, regions });
    onFilter({ ...filter, regions })
  }
  const onBranchChange = (branches) => {
    setFilter({ ...filter, branches });
    onFilter({ ...filter, branches })
  }
  const onCityChange = (cities) => {
    setFilter({ ...filter, cities });
    onFilter({ ...filter, cities })
  }
  const onManagerChange = (managers) => {
    setFilter({ ...filter, managers });
    onFilter({ ...filter, managers })
  }
  const onTypeChange = (types) => {
    setFilter({ ...filter, types });
    onFilter({ ...filter, types })
  }
  const variables = {
    now: filter.now,
    regions: (filter.regions && filter.regions.length !== 0) ? filter.regions : null
  }

  const { loading, data } = useQuery(
    GLOBAL_FILTER, 
    { 
      variables, 
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true 
    }
  )
  if (!loading) {
    region_options = []
    //2nd level branch_options 
    branch_options = []
    //3rd level employee_options 
    branch_employee_options = []
    //3rd level connected_city_options 
    connected_city_options = []
    //truck_type_options = []
    truck_type_options = data.truck_type.map(_truck_type => { return { label: _truck_type.name, value: _truck_type.id } })

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
    //const branch_options = data.region.map(_region => { return { label: _region.name, value: _region.id } })
  }
  
  return (
    <Row >
      <Collapse className='global-filter' defaultActiveKey={['branch']} >
        <Panel header={<b>Region</b>} key={'region'} extra={<span className='clear' onClick={(e) => e.stopPropagation()}>CLEAR</span>}>
          <ul className='filterMenu'><li><CheckBoxGroup defaultValue={filter.regions} options={region_options} onChange={onRegionChange} /></li></ul>
        </Panel>
        <Panel header={<b>Branch</b>} key={'branch'} extra={<span className='clear' onClick={(e) => e.stopPropagation()}>CLEAR</span>}>
          <ul className='filterMenu'><li><CheckBoxGroup options={branch_options} onChange={onBranchChange} /></li></ul>
        </Panel>
        <Panel header={<b>City</b>} key={'city'} extra={<span className='clear' onClick={(e) => e.stopPropagation()}>CLEAR</span>}>
          <ul className='filterMenu'><li><CheckBoxGroup defaultValue={filter.cities} options={connected_city_options} onChange={onCityChange} /></li></ul>
        </Panel>
        <Panel header={<b>Manager</b>} key={'manager'} extra={<span className='clear' onClick={(e) => e.stopPropagation()}>CLEAR</span>}>
          <ul className='filterMenu'><li><CheckBoxGroup options={branch_employee_options} onChange={onManagerChange} /></li></ul>
        </Panel>
        <Panel header={<b>Type</b>} key={'type'} extra={<span className='clear' onClick={(e) => e.stopPropagation()}>CLEAR</span>}>
          <ul className='filterMenu'><li><CheckBoxGroup options={truck_type_options} onChange={onTypeChange} /></li></ul>
        </Panel>
      </Collapse>
    </Row>
  )
}

export default GlobalFilter
