
import { Row, Col, Input, Card } from 'antd'
import Trucks from '../trucks'

import { gql, useQuery } from '@apollo/client'

const TRUCKS_QUERY = gql`
  query trucks($offset: Int!, $limit: Int! , $trip_status_id:[Int!]) {
    truck(offset: $offset, limit: $limit) {
      truck_no
      truck_type_id
      truck_status_id
      truck_type{
        value
      }
      city {
        name
      }
      truck_status {
        id
        value
      }
      partner {
        id
        name
        partner_users(limit:1 , where:{is_admin:{_eq:true}}){
          mobile
        }
        cardcode
      }
      trips(where: {trip_status_id: {_in: $trip_status_id}}) {
        id
        source {
          name
        }
        destination {
          name
        }
      }
    }
    truck_status{
      id 
      value
    }
    
  }
      
`

const { Search } = Input

export const trucksQueryVars = {
  offset: 0,
  limit: 10,
  trip_status_id: [2, 3, 4, 5, 6]
}

const TruckContainer = () => {
  const { loading, error, data } = useQuery(
    TRUCKS_QUERY,
    {
      variables: trucksQueryVars,
      notifyOnNetworkStatusChange: true
    }
  )

  console.log('TrucksContainer error', error)
  var truck = []
  var truck_status = []
  
  if (!loading) {
    truck = data.truck
    truck_status = data.truck_status
  }

  return (
    <Card size='small' className='card-body-0 border-top-blue'>
      <Row justify='end' className='m5'>
        <Col flex='180px'>
          <Search
            placeholder='Search...'
            onSearch={(value) => console.log(value)}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24}>
          <Card size='small' className='card-body-0'>
            <Trucks trucks={truck} status={truck_status} loading={loading} />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
export default TruckContainer
