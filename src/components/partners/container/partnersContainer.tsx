import React from 'react'
import { Button, Card } from 'antd'
import Link from 'next/link'
import PartnerKyc from '../partnerKyc'
import { useState } from 'react'

import { gql, useQuery } from '@apollo/client'

const PARTNERS_QUERY = gql`
  query partners($offset: Int!, $limit: Int!) {
    partner(offset: $offset, limit: $limit) {
      id
      name
      cardcode
      pan
      onboarded_by{
        id
        name
      }
      created_at
      partner_status{
        value
      }
      # city {
      #   branch {
      #     region {
      #       name
      #     }
      #   }
      # }
      partner_status{
       value
      } 
      partner_users(limit:1 , where:{is_admin:{_eq:true}}){
        mobile
      }
      partner_comments(limit:1,order_by:{created_at:desc}){
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
    partner_aggregate{
      aggregate{
        count
      }
    }
}
`

const PartnerContainer = () => {
  const initialFilter = { offset: 0, limit: 1 }
  const [filter, setFilter] = useState(initialFilter)
  const partnersQueryVars = {
    offset: filter.offset,
    limit: filter.limit
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
  var partner = []
  var partner_aggregate = 0
  if (!loading) {
    partner = data && data.partner
    partner_aggregate = data && data.partner_aggregate
  }
console.log('partner_aggregate',partner_aggregate)
  const record_count = partner_aggregate && partner_aggregate.aggregate && partner_aggregate.aggregate.count

  const total_page = Math.ceil( record_count /filter.limit)
  console.log('record_count', record_count)
  
  const onPageChange = (value) => {
    setFilter({ ...filter, offset: value })
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
      <PartnerKyc partners={partner} 
      loading={loading}
      onPageChange={onPageChange}
      total_page={total_page}
      record_count={record_count} 
      filter={filter}
      />
    </Card>
  )
}
export default PartnerContainer
