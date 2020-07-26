import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import Timeline from '../truckTimeline'
import { Row, Col, Button, Card, Divider, Space, Tag, Tabs } from 'antd'
import AssignTrip from '../assignTrip'
import Loading from '../../common/loading'
import DetailPageHeader from '../../common/detailPageHeader'

import { useSubscription } from '@apollo/client'
import { TRUCK_DETAIL_SUBSCRIPTION } from './query/truckDetailSubscription'

const TabPane = Tabs.TabPane

const TruckDetailContainer = (props) => {
  const { truckNo } = props

  const { loading, error, data } = useSubscription(
    TRUCK_DETAIL_SUBSCRIPTION,
    {
      variables: { truck_no: truckNo }
    }
  )

  if (loading) return <Loading />
  console.log('TruckDetailContainer Error', error)

  const { truck } = data
  const truckInfo = truck[0] ? truck[0] : { name: 'ID does not exist' }

  return (
    <div>
      <Row>
        <Col xs={24}>
          <Card
            size='small'
            className='border-top-blue'
            title={
              <DetailPageHeader
                title={
                  <Space>
                    <h3>{truckInfo.truck_no}</h3>
                    <Divider type='vertical' />
                    <h4>{truckInfo.truck_type.value}</h4>
                  </Space>
                }
                extra={
                  <Space>
                    <AssignTrip />
                    <Tag className='status'>Waiting for load</Tag>
                  </Space>
                }
              />
            }
          >
            <Truck truckInfo={truckInfo} />
            <Row>
              <Col xs={24}>
                <Card size='small' className='card-body-0 border-top-blue'>
                  <Tabs defaultActiveKey='1'>
                    <TabPane tab='Details' key='1'>
                      <Row>
                        <Col xs={24} className='p20'>
                          <TruckInfo />
                          <Divider />
                          <Documents />
                          <Divider />
                          <div className='text-right'>
                            <Space>
                              <Button type='primary' htmlType='submit'>Submit</Button>
                              <Button>Cancel</Button>
                            </Space>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab='Trips' key='2'>
                      <TripDetail />
                    </TabPane>
                    <TabPane tab='Timeline' key='3'>
                      <Row>
                        <Col xs={24} className='p20'>
                          <Timeline />
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default TruckDetailContainer
