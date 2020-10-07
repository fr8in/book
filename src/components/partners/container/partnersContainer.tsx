import { useState } from 'react'
import { Button, Card } from 'antd'
import Link from 'next/link'
import Partners from '../partners'
import u from '../../../lib/util'
import get from 'lodash/get'
import { gql, useQuery } from '@apollo/client'

const PARTNERS_QUERY = gql`
query partners(
  $offset: Int!, 
  $limit: Int!,
  $partner_statusId:[Int!], 
  $name:String, 
  $cardcode:String,
  $region:[String!]
  ) {
  partner(
    offset: $offset, 
    limit: $limit,
    where:{
      city:{branch:{region:{name:{_in:$region}}}},
      partner_status:{id:{_in:$partner_statusId}}, 
      name: {_ilike: $name}, 
      cardcode: {_ilike: $cardcode}
    }
    ) {
    id
    name
    cardcode
    pan
    gst
    cibil
    onboarded_by_id
    partner_advance_percentage_id
    emi
    tds_percentage_id
    onboarded_by{
      id
      name
    }
    created_at
    partner_status{
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
    partner_users(limit:1 , where:{is_admin:{_eq:true}}){
      mobile
    }
    last_comment{
      partner_id
      description
      created_at
      created_by
    }
    trucks_aggregate(where:{truck_status_id:{_neq:7}}){
      aggregate{
        count
      }
    }
  }
  partner_aggregate(
    where:{
      city:{branch:{region:{name:{_in:$region}}}},
      partner_status:{id:{_in:$partner_statusId}}, 
      name: {_ilike: $name}, 
      cardcode: {_ilike: $cardcode}
    }
  )
  {
    aggregate{
      count
    }
  }
  partner_status(where:{name: {_nin: ["Lead","Registered","Rejected"]}},order_by:{id:asc}){
    id
    name
  }
  region{
    name
    id
  }  
}
`

const PartnerContainer = () => {
  const initialFilter = {
    partner_statusId: [1],
    region: null,
    offset: 0,
    limit: u.limit,
    name: null,
    cardcode: null
  }
  const [filter, setFilter] = useState(initialFilter)
  const partnersQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
    region: filter.region,
    partner_statusId: filter.partner_statusId,
    name: filter.name ? `%${filter.name}%` : null,
    cardcode: filter.cardcode ? `%${filter.cardcode}%` : null
  }

  const { loading, error, data } = useQuery(
    PARTNERS_QUERY,
    {
      variables: partnersQueryVars,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('PartnersContainer error', error)

  let _data = {}
  if (!loading) {
    _data = data
  }
  const partner = get(_data, 'partner', [])
  const partner_status = get(_data, 'partner_status', [])
  const partner_aggregate = get(_data, 'partner_aggregate', 0)
  const region = get(_data, 'region', [])
  console.log('partner_aggregate', partner_aggregate)

  const record_count = get(partner_aggregate, 'aggregate.count', 0)

  console.log('record_count', record_count)

  const onFilter = (name) => {
    setFilter({ ...filter, partner_statusId: name })
  }
  const onRegionFilter = (name) => {
    setFilter({ ...filter, region: name })
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

  return (
    <Card
      size='small'
      extra={
        <Link href='partners/create-partner'>
          <Button type='primary'>Create Partner</Button>
        </Link>
      }
      className='card-body-0 border-top-blue'
    >
      <Partners
        partners={partner}
        loading={loading}
        onPageChange={onPageChange}
        record_count={record_count}
        filter={filter}
        onFilter={onFilter}
        onRegionFilter={onRegionFilter}
        partner_status_list={partner_status}
        region_list={region}
        onNameSearch={onNameSearch}
        onCardCodeSearch={onCardCodeSearch}
      />
    </Card>
  )
}
export default PartnerContainer
