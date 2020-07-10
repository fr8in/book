
import { Row, Col, Card, Tabs } from 'antd'
import PageLayout from '../../components/layout/PageLayout'
import Loads from '../../components/trips/loads/loads'

const { TabPane } = Tabs
const DashboardPage = () => {
  const callback = (key) => {
    console.log(key)
  }
  return (
    <PageLayout title='Dashboard'>
      {/** All trips status wise: Filter applocable for Source city
        ** Waiting for load and Delivery On-hold records */}
      <Row className='mb10'>
        <Col sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs defaultActiveKey='1' onChange={callback}>
              <TabPane tab='Unloading(s)' key='1'>
                <Loads />
              </TabPane>
              <TabPane tab='Load' key='2'>
                <Loads />
              </TabPane>
              <TabPane tab='Assigned' key='3'>
                <Loads />
              </TabPane>
              <TabPane tab='Confirmed' key='4'>
                <Loads />
              </TabPane>
              <TabPane tab='Loading' key='5'>
                <Loads />
              </TabPane>
              <TabPane tab='Intransit(S)' key='6'>
                <Loads />
              </TabPane>
              <TabPane tab='Delivery On-hold' key='7'>
                <Loads />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
      {/** Unloading and Intransit: Filter applocable for Destination city */}
      <Row className='mb10'>
        <Col sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs defaultActiveKey='1' onChange={callback}>
              <TabPane tab='Unloading(D)' key='1'>
                <Loads />
              </TabPane>
              <TabPane tab='Intransit(D)' key='2'>
                <Loads />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
      {/** Excess Loads */}
      <Row>
        <Col sm={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs defaultActiveKey='1' onChange={callback}>
              <TabPane tab='Loads' key='1'>
                <Loads />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </PageLayout>
  )
}

export default DashboardPage
