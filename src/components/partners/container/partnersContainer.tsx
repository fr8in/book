import { useState } from 'react'
import { Button, Card } from 'antd'
import Link from 'next/link'
import Partners from '../partners'

import { gql, useQuery } from '@apollo/client'

const PARTNERS_QUERY = gql`
  query partners($offset: Int!, $limit: Int!,$partner_statusId:[Int!], $name:String, $cardcode:String) {
    partner(offset: $offset, limit: $limit,where:{partner_status:{id:{_in:$partner_statusId}}, name: {_ilike: $name}, cardcode: {_ilike: $cardcode}}) {
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
        name
      }
      # city {
      #   branch {
      #     region {
      #       name
      #     }
      #   }
      # }
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
    partner_aggregate(where:{partner_status:{id:{_in:$partner_statusId}}})
    {
      aggregate{
        count
      }
    }
    partner_status(order_by:{id:asc}){
      id
      name
    }
}
`

const PartnerContainer = () => {
  const initialFilter = { partner_statusId: [1], offset: 0, limit: 1, name: null, cardcode: null }
  const [filter, setFilter] = useState(initialFilter)
  const partnersQueryVars = {
    offset: filter.offset,
    limit: filter.limit,
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
  var partner = []
  var partner_status = []
  var partner_aggregate = 0
  if (!loading) {
    partner = data && data.partner
    partner_status = data && data.partner_status
    partner_aggregate = data && data.partner_aggregate
  }
  console.log('partner_aggregate', partner_aggregate)

  const partner_status_list = partner_status.filter(data => data.id !== 8)

  const record_count = partner_aggregate && partner_aggregate.aggregate && partner_aggregate.aggregate.count

  const total_page = Math.ceil(record_count / filter.limit)
  console.log('record_count', record_count)

  const onFilter = (name) => {
    setFilter({ ...filter, partner_statusId: name })
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
        total_page={total_page}
        record_count={record_count}
        filter={filter}
        onFilter={onFilter}
        partner_status_list={partner_status_list}
        onNameSearch={onNameSearch}
        onCardCodeSearch={onCardCodeSearch}
      />
    </Card>
  )
}
export default PartnerContainer
