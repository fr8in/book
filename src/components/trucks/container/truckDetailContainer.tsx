import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import Timeline from '../truckTimeline'
import { Row, Col, Button, Card, Divider, Space, Tag, Tabs } from 'antd'
import AssignTrip from '../assignTrip'
import Loading from '../../common/loading'
import DetailPageHeader from '../../common/detailPageHeader'
import TruckTruckType from '../../../components/trucks/truckTruckType'

import { useSubscription } from '@apollo/client'
import { TRUCK_DETAIL_SUBSCRIPTION } from './query/truckDetailSubscription'

const TabPane = Tabs.TabPane
const tripStatusId = [2, 3, 4, 5, 6]

const TruckDetailContainer = (props) => {
  const { truckNo } = props
  console.log('truck Id', truckNo)

  const { loading, error, data } = useSubscription(
    TRUCK_DETAIL_SUBSCRIPTION,
    {
      variables: { truck_no: truckNo, trip_status_id: tripStatusId }
    }
  )

  if (loading) return <Loading />
  console.log('TruckDetailContainer Error', error)
  console.log('TruckDetailContainerData', data)

  const { truck } = data
  const truckInfo = truck[0] ? truck[0] : { name: 'ID does not exist' }
  const trips = truckInfo.trips
  console.log('trips', trips)

  return (
    <Card
      size='small'
      className='border-top-blue'
      title={
        <DetailPageHeader
          title={
            <Space>
              <h3>{truckInfo.truck_no}</h3>
              <Divider type='vertical' />
              <h4>
                <TruckTruckType
                  truck_no={truckInfo.truck_no}
                  truck_type_id={truckInfo.truck_type_id}
                />
              </h4>
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
                <TripDetail trip trips={trips} />
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
  )
}
export default TruckDetailContainer
