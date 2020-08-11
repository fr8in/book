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

  const initial = { excessLoad: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const initialVars = { tabKey: '2', trip_status: 'Reported at destination', now: new Date().toISOString() }
  const [vars, setVars] = useState(initialVars)

  const variables = {
    now: vars.now,
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities > 0) ? filters.cities : null,
    trip_status: vars.trip_status ? vars.trip_status : null
  }
  const { loading, data, error } = useSubscription(DASHBOAD_QUERY, { variables })
  console.log('dashboard error', error)

  let trucks = []
  let trips = []
  let unloading_count = 0
  let assigned_count = 0
  let confirmed_count = 0
  let loading_count = 0
  let intransit_count = 0
  let intransit_d_count = 0
  let unloading_d_count = 0
  let excess_count = 0
  let hold_count = 0
  let truck_count = 0
  let truck_current_count = 0

  if (!loading) {
    const newData = { data }

    trips = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trips').value()
    trucks = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks').value()

    const unloading_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('unloading').flatMap('aggregate').flatMap('count').value()
    unloading_count = unloading_aggrigate.reduce((a, b) => a + b, 0)

    const assigned_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('assigned').flatMap('aggregate').flatMap('count').value()
    assigned_count = assigned_aggrigate.reduce((a, b) => a + b, 0)

    const confirmed_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('confirmed').flatMap('aggregate').flatMap('count').value()
    confirmed_count = confirmed_aggrigate.reduce((a, b) => a + b, 0)

    const loading_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('loading').flatMap('aggregate').flatMap('count').value()
    loading_count = loading_aggrigate.reduce((a, b) => a + b, 0)

    const intransit_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('intransit').flatMap('aggregate').flatMap('count').value()
    intransit_count = intransit_aggrigate.reduce((a, b) => a + b, 0)

    const intransit_d_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('intransit_d').flatMap('aggregate').flatMap('count').value()
    intransit_d_count = intransit_d_aggrigate.reduce((a, b) => a + b, 0)

    const unloading_d_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('unloading_d').flatMap('aggregate').flatMap('count').value()
    unloading_d_count = unloading_d_aggrigate.reduce((a, b) => a + b, 0)

    const excess_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('excess').flatMap('aggregate').flatMap('count').value()
    excess_count = excess_aggrigate.reduce((a, b) => a + b, 0)

    const hold_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('hold').flatMap('aggregate').flatMap('count').value()
    hold_count = hold_aggrigate.reduce((a, b) => a + b, 0)

    const truck_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks_total').flatMap('aggregate').flatMap('count').value()
    truck_count = truck_aggrigate.reduce((a, b) => a + b, 0)

    const truck_c_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks_current').flatMap('aggregate').flatMap('count').value()
    truck_current_count = truck_c_aggrigate.reduce((a, b) => a + b, 0)
  }
  const onTabChange = (key) => {
    setVars({ ...vars, tabKey: key })
    switch (key) {
      case '1':
        setVars({ ...vars, trip_status: initialVars.trip_status })
        break
      case '3':
        setVars({ ...vars, trip_status: 'Assigned' })
        break
      case '4':
        setVars({ ...vars, trip_status: 'Confirmed' })
        break
      case '5':
        setVars({ ...vars, trip_status: 'Reported at source' })
        break
      case '6':
        setVars({ ...vars, trip_status: 'Intransit' })
        break
      case '7':
        setVars({ ...vars, trip_status: 'Intransit' })
        break
      case '8':
        setVars({ ...vars, trip_status: 'Reported at destination' })
        break
      case '10':
        setVars({ ...vars, trip_status: 'Delivery onhold' })
        break
      default:
        setVars({ ...vars, trip_status: initialVars.trip_status })
        break
    }
  }
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
                <TabPane tab={<TitleWithCount name='Unloading' value={unloading_count} />} key='1'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='WF.Load' value={truck_current_count + '/' + truck_count} />} key='2'>
                  <WaitingForLoad trucks={trucks} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Assigned' value={assigned_count} />} key='3'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Confirmed' value={confirmed_count} />} key='4'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loading' value={loading_count} />} key='5'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit' value={intransit_count} />} key='6'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit(D)' value={intransit_d_count} />} key='7'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Unloading(D)' value={unloading_d_count} />} key='8'>
                  <Trips trips={trips} loading={loading} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loads' value={excess_count} />} key='9'>
                  <ExcessLoad />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Hold' value={hold_count} />} key='10'>
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
