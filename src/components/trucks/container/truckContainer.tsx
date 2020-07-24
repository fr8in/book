
import { Row, Col, Input, Card } from 'antd'
import Trucks from '../trucks'

import { useQuery } from '@apollo/client'
import { TRUCKS_QUERY } from './query/trucksQuery'
import Loading from '../../common/loading'

const { Search } = Input

export const trucksQueryVars = {
  offset: 0,
  limit: 10
}

const TruckContainer = () => {
  const { loading, error, data } = useQuery(
    TRUCKS_QUERY,
    {
      variables: trucksQueryVars,
      notifyOnNetworkStatusChange: true
    }
  )

  if (loading) return <Loading />
  console.log('TrucksContainer error', error)

  console.log('TrucksContainer data', data)
  const { truck } = data
  console.log('truck', truck)

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
            <Trucks trucks={truck} />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
export default TruckContainer
