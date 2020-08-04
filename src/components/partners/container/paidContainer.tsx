import React from 'react'
import PaidStatus from '../../trips/tripsByStages'
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const PAID_QUERY = gql`
query partners($offset: Int!, $limit: Int!,$trip_status_value:[String!],$cardcode: String){
    partner{
       trips(where: {trip_status: {value: {_in: $trip_status_value}}}) {
        id
        order_date
        source {
          name
        }
        destination {
          name
        }
        source_in
        trip_status {
          value
        }
      }
    }
  }
` 
const paid = ["Paid", "Closed"] 
const PaidContainer = (props) =>{
    
    const [tripStatusId, setTripStatusId ] = useState(paid)
    const onStatusChange = (key) => {
        console.log('key',key)
        if(key === '7') {
          setTripStatusId(paid)
        }
      } 
      const { cardcode } = props
    const tripStatusValue={
        offset: 0,
        limit: 10,
        cardcode : cardcode,
        trip_status_value: tripStatusId
    }
    const { loading, error, data } = useQuery(
        PAID_QUERY,
        {
          variables: tripStatusValue,
          fetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true
        }
      )
      console.log('PaidContainer error', error)
     var trips = [];
     var partnerData = [];
    if (!loading) {
        const { partner } = data
        partnerData = partner[0] ? partner[0] : { name: 'ID does not exist' }
      trips = partnerData && partnerData.trips
    }
   
    // const record_count =
    // customer_aggregate.aggregate && customer_aggregate.aggregate.count;
    // const total_page = Math.ceil(record_count / filter.limit);


    // const onPageChange = (value) => {
    //     setFilter({ ...filter, offset: value });
    //   };
      return(
        <PaidStatus
         trips= {trips}
         loading={loading}  
         onChange={onStatusChange}
        //  record_count={record_count}
        //  total_page={total_page}
        //  filter={filter}
        //  onPageChange={onPageChange}
         />
      )
}
export default PaidContainer 