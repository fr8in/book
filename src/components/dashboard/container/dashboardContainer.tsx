import { useState } from 'react'
import { Row, Col, Card, Tabs, Button, Space } from 'antd'
import Trips from '../../trips/activeTrips'
import WaitingForLoad from '../../trucks/waitingForLoad'
import Orders from '../../reports/orders'
import Revenue from '../../reports/revenue'
import Progress from '../../reports/progress'
import { WhatsAppOutlined, CarOutlined } from '@ant-design/icons'
import ExcessLoad from '../../trips/excessLoad'
import TitleWithCount from '../../common/titleWithCount'
import useShowHide from '../../../hooks/useShowHide'
import CreateExcessLoad from '../../trips/createExcessLoad'
import DASHBOAD_QUERY from './query/dashboardQuery'
import { useSubscription } from '@apollo/client'
import _ from 'lodash'

const { TabPane } = Tabs

const DashboardContainer = (props) => {
  const { filters } = props
  console.log(filters)
  const initial = { excessLoad: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const initialVars = { tabKey: '2', trip_status: 'Reported at destination' }
  const [vars, setVars] = useState(initialVars)

  const variables = {
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities > 0) ? filters.cities : null,
    trip_status: vars.trip_status ? vars.trip_status : null
  }
  const { loading, data, error } = useSubscription(DASHBOAD_QUERY, { variables })
  console.log('dashboard error', error)

  let trucks = []
  let trips = []
  if (!loading) {
    const newData = { data }
    trips = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trips').value()
    trucks = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks').value()
  }

  const onTabChange = (key) => {
    setVars({ ...vars, tabKey: key })
    if (key === '1') {
      setVars({ ...vars, trip_status: 'Reported at destination' })
    }
    if (key === '3') {
      setVars({ ...vars, trip_status: 'Assigned' })
    }
    if (key === '4') {
      setVars({ ...vars, trip_status: 'Confirmed' })
    }
    if (key === '5') {
      setVars({ ...vars, trip_status: 'Reported at source' })
    }
    if (key === '6') {
      setVars({ ...vars, trip_status: 'Intransit' })
    }
    if (key === '7') {
      setVars({ ...vars, trip_status: 'Intransit' })
    }
    if (key === '8') {
      setVars({ ...vars, trip_status: 'Reported at destination' })
    }
    if (key === '10') {
      setVars({ ...vars, trip_status: 'Delivery onhold' })
    }
  }
  console.log('dashboard', trips, trucks)
  return (
    <Row>
      <Col xs={24}>
        {/* Statictics data */}
        <Row gutter={[0, 10]}>
          <Col xs={24} style={{ overflow: 'hidden' }}>
            <Row gutter={10}>
              <Col xs={24} sm={9} md={8}>
                <Orders />
              </Col>
              <Col xs={24} sm={15} md={8}>
                <Revenue />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Progress />
              </Col>
            </Row>
          </Col>
        </Row>
        {/** All trips status wise: Filter applocable for Source city
        ** Waiting for load and Delivery On-hold records */}
        <Row gutter={[0, 10]}>
          <Col xs={24} sm={24}>
            <Card size='small' className='card-body-0 border-top-blue'>
              <Tabs
                onChange={onTabChange}
                defaultActiveKey='2'
                tabBarExtraContent={
                  <Space>
                    <Button size='small' shape='circle' type='primary' className='btn-success' icon={<WhatsAppOutlined />} />
                    <Button size='small' type='primary' shape='circle' icon={<CarOutlined />} onClick={() => onShow('excessLoad')} />
                  </Space>
                }
              >
                <TabPane tab={<TitleWithCount name='Unloading' value={20} />} key='1'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='WF.Load' value={200} />} key='2'>
                  <WaitingForLoad trucks={trucks} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Assigned' value={57} />} key='3'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Confirmed' value={57} />} key='4'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loading' value={5} />} key='5'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit' value={36} />} key='6'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit(D)' value={57} />} key='7'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab='Unloading(D)' key='8'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab='Loads' key='9'>
                  <ExcessLoad />
                </TabPane>
                <TabPane tab='Hold' key='10'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Col>
      {visible.excessLoad && <CreateExcessLoad visible={visible.excessLoad} onHide={onHide} />}
    </Row>
  )
}

export default DashboardContainer
