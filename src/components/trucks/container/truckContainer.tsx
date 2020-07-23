
import { Row, Col, Input, Card } from 'antd'
import TrucksList from '../trucks'

const { Search } = Input

export default function truckContainer () {
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
            <TrucksList />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}
