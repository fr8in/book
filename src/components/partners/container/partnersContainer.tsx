import React from 'react'
import { Row, Button, Card } from 'antd'
import Link from 'next/link'
import PartnerKyc from '../partnerKyc'

import { gql, useQuery } from '@apollo/client'
import Loading from '../../common/loading'

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
      city {
        branch {
          region {
            name
          }
        }
      }
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
}
`

export const partnersQueryVars = {
  offset: 0,
  limit: 10
}
const PartnerContainer = () => {
  const { loading, error, data } = useQuery(
    PARTNERS_QUERY,
    {
      variables: partnersQueryVars,
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('PartnersContainer error', error)
  var partner = []
  if (!loading) {
    partner = data.partner
  }

  return (
    <div>
      <Row justify='end' className='m5'>
        <Link href='partners/create-partner'>
          <Button type='primary'>Create Partner</Button>
        </Link>
      </Row>
      <Card size='small' className='card-body-0 border-top-blue'>
        <PartnerKyc partners={partner} loading={loading} />
      </Card>
    </div>
  )
}
export default PartnerContainer
