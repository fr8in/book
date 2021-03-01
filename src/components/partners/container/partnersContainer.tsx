import { useState, useContext } from 'react'
import { Button, Card, Space,Input } from 'antd'
import Link from 'next/link'
import Partners from '../partners'
import u from '../../../lib/util'
import get from 'lodash/get'
import { gql, useQuery, useSubscription } from '@apollo/client'
import userContext from '../../../lib/userContaxt'
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { SearchOutlined } from '@ant-design/icons'


const PARTNERS_SUBSCRIPTION = gql`
subscription partners(
  $offset: Int!, $limit: Int!, 
  $partner_statusId: [Int!], 
  $active_category:[Int!],
  $name: String, $cardcode: String, $region: [String!]) {
  partner(offset: $offset,
     limit: $limit, where: 
     {_or: [{city: {connected_city: {branch: {region: {name: {_in: $region}}}}}}, 
      {city: {connected_city: {branch_id: {_is_null: true}}}}], 
      partner_status: { id: {_in: $partner_statusId}}, name: {_ilike: $name}, 
      active_category_id:{_in:$active_category}
      cardcode: {_ilike: $cardcode}}) {
    id
    name
    cardcode
    pan
    gst
    cibil
    onboarded_by_id
    active_category_id
    partner_advance_percentage_id
    emi
    tds_percentage_id
    onboarded_by {
      id
      name
    }
    created_at
    partner_status {
      id
      name
    }
    city {
      branch {
        region {
          name
        }
      }
    }
    partner_users(limit: 1, where: {is_admin: {_eq: true}}) {
      mobile
    }
    last_comment {
      partner_id
      description
      created_at
      created_by
    }
    trucks_aggregate(where: {truck_status_id: {_neq: 7}}) {
      aggregate {
        count
      }
    }
  }
}`

const PARTNERS_QUERY = gql`
query partners($partner_statusId: [Int!], $name: String,$active_category:[Int!], $cardcode: String, $region: [String!]) {
  partner_aggregate(where: {_or: [{city: {connected_city: {branch: {region: {name: {_in: $region}}}}}},
     {city: {connected_city: {branch_id: {_is_null: true}}}}], 
     partner_status: {id: {_in: $partner_statusId}}, name: {_ilike: $name}, cardcode: {_ilike: $cardcode},active_category_id:{_in:$active_category}}) {
    aggregate {
      count
    }
  }
  partner_status(where: {name: {_nin: ["Lead","Registered","Rejected","Verification"]}}) {
    id
    name
  }
  region {
    name
    id
  }
  partner_active_category{
    id
    name
  }
}`

const PartnerContainer = () => {
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  
  const { Search } = Input;

  const [currentPage, setCurrentPage] = useState(1)
  const access = u.is_roles(edit_access,context)
  const initialFilter = {
    partner_statusId: [4],
    region: null,
    offset: 0,
    limit: u.limit,
    name: null,
    cardcode: null,
    activecategory:null
  }
  const [filter, setFilter] = useState(initialFilter)
  const partnersQueryVars = {
    ...!isEmpty(filter.region) && { region: filter.region ? filter.region : null},
    ...!isEmpty(filter.activecategory) && { active_category: filter.activecategory ? filter.activecategory : null},
    partner_statusId: filter.partner_statusId,
    name: filter.name ? `%${filter.name}%` : null,
    cardcode: filter.cardcode ? `%${filter.cardcode}%` : null
  }
  const variables = {
    offset: filter.offset,
    limit: filter.limit,
    ...!isEmpty(filter.region) && { region: filter.region ? filter.region : null},
    ...!isEmpty(filter.activecategory) && { active_category: filter.activecategory ? filter.activecategory : null},
    partner_statusId: filter.partner_statusId,
    name: filter.name ? `%${filter.name}%` : null,
    cardcode: filter.cardcode ? `%${filter.cardcode}%` : null
  }
  const { loading: s_loading, error: s_error, data: s_data } = useSubscription(
    PARTNERS_SUBSCRIPTION,
    {
      variables: variables
    }
  )

  const { loading, error, data } = useQuery(
    PARTNERS_QUERY,
    {
      variables: partnersQueryVars,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('PartnersContainer error', error)
  console.log('PartnersContainer s_error', s_error)

  let _sdata = {}
  if (!s_loading) {
    _sdata = s_data
  }
  const partner = get(_sdata, 'partner', [])

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner_status = get(_data, 'partner_status', [])
  const partner_aggregate = get(_data, 'partner_aggregate', 0)
  const region = get(_data, 'region', [])
  const partner_active_category = get(_data, 'partner_active_category', [])

  const record_count = get(partner_aggregate, 'aggregate.count', 0)

  const onFilter = (name) => {
    setFilter({ ...filter, partner_statusId: name })
  }
  const onRegionFilter = (name) => {
    setFilter({ ...filter, region: name })
  }

  const onPartnerFilter = (name) => {
    setFilter({ ...filter, activecategory: name })
  }

  const onPageChange = (name) => {
    setFilter({ ...filter, offset: name })
  }

  const onNameSearch = (name) => {
    setFilter({ ...filter, name: name })
  }

  const onCardCodeSearch = (name) => {
    setFilter({ ...filter, cardcode: name })
  }

  const handleName = (e) => {
    onNameSearch(e.target.value)
    setCurrentPage(1)
  }


  return (
    <Card
      size='small'
      extra={
        <Space>
  <Input placeholder="Partner Search" suffix={<SearchOutlined/>}   value={filter.name} onChange={handleName} style={{ width: 200 }} />
       { access ? (
        <Link href='partners/create-partner'>
          <Button type='primary'>Create Partner</Button>
        </Link>) : ''} </Space>}
      className='card-body-0 border-top-blue'
    >
      <Partners
        partners={partner}
        loading={s_loading}
        onPageChange={onPageChange}
        record_count={record_count}
        filter={filter}
        onFilter={onFilter}
        onRegionFilter={onRegionFilter}
        onPartnerFilter={onPartnerFilter}
        partner_status_list={partner_status}
        region_list={region}
        partner_active_category={partner_active_category}
        onNameSearch={onNameSearch}
        onCardCodeSearch={onCardCodeSearch}
        edit_access={access}
      />
    </Card>
  )
}
export default PartnerContainer
