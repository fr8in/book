import React from 'react'
import {Row, Button, Card} from 'antd'
import Link from 'next/link'
import Partners from '../partners'

import { useQuery } from '@apollo/client'
import { PARTNERS_QUERY } from '../query/partnersQuery'
import Loading from '../../common/loading'

export const partnersQueryVars = {
    offset: 0,
    limit: 10
  }
const partnerContainer = () => {

    const { loading, error, data } = useQuery(
        PARTNERS_QUERY,       
         {
          variables: partnersQueryVars,
          notifyOnNetworkStatusChange: true
        }
      )
    
      if (loading) return <Loading />
      console.log('PartnersContainer error', error)
    
      const { partner } = data
    return (
        <div>
            <Row justify='end' className='m5'>    
                <Link href='partners/create-partner'>
                   <Button type="primary">Create Partner</Button>                 
                </Link>
            </Row>
                <Card size='small' className='card-body-0 border-top-blue' >
                     <Partners partners={partner} />
                </Card>
        </div>
    )
}
export default partnerContainer;
