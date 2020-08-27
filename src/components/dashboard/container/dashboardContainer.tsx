import { Row, Col, Card, Tabs, Button, Space } from 'antd'
import TripsContainer from './dashboardTripsContainer'
import TripsByDestination from '../../trips/tripsByDestination'
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
import WaitingForLoadContainer from './waitingForLoadContainer'

const { TabPane } = Tabs

const DashboardContainer = (props) => {
  const { filters } = props
  console.log('filters', filters)
  const initial = { excessLoad: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const variables = {
    now: filters.now,
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities > 0) ? filters.cities : null,
    truck_type: (filters.types && filters.types > 0) ? filters.types : null,
    managers: (filters.managers && filters.managers > 0) ? filters.managers : null
  }
  const { loading, data, error } = useSubscription(DASHBOAD_QUERY, { variables })
  console.log('dashboard error', error)

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

    const unloading_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('unloading').flatMap('aggregate').value()
    unloading_count = _.sumBy(unloading_aggrigate, 'count')

    const assigned_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('assigned').flatMap('aggregate').value()
    assigned_count = _.sumBy(assigned_aggrigate, 'count')

    const confirmed_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('confirmed').flatMap('aggregate').value()
    confirmed_count = _.sumBy(confirmed_aggrigate, 'count')

    const loading_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('loading').flatMap('aggregate').value()
    loading_count = _.sumBy(loading_aggrigate, 'count')

    const intransit_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('intransit').flatMap('aggregate').value()
    intransit_count = _.sumBy(intransit_aggrigate, 'count')

    const intransit_d_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('intransit_d').flatMap('aggregate').value()
    intransit_d_count = _.sumBy(intransit_d_aggrigate, 'count')

    const unloading_d_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('unloading_d').flatMap('aggregate').value()
    unloading_d_count = _.sumBy(unloading_d_aggrigate, 'count')

    const excess_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('excess').flatMap('aggregate').value()
    excess_count = _.sumBy(excess_aggrigate, 'count')

    const hold_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('hold').flatMap('aggregate').value()
    hold_count = _.sumBy(hold_aggrigate, 'count')

    const truck_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks_total').flatMap('aggregate').value()
    truck_count = _.sumBy(truck_aggrigate, 'count')

    const truck_c_aggrigate = _.chain(newData).flatMap('region').flatMap('branches').flatMap('connected_cities').flatMap('cities').flatMap('trucks_current').flatMap('aggregate').value()
    truck_current_count = _.sumBy(truck_c_aggrigate, 'count')
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
        <Row gutter={[0, 10]}>
          <Col xs={24} sm={24}>
            <Card size='small' className='card-body-0 border-top-blue'>
              <Tabs
                defaultActiveKey='1'
                tabBarExtraContent={
                  <Space>
                    <Button size='small' shape='circle' type='primary' className='btn-success' icon={<WhatsAppOutlined />} />
                    <Button size='small' type='primary' shape='circle' icon={<CarOutlined />} onClick={() => onShow('excessLoad')} />
                  </Space>
                }
              >
                <TabPane tab={<TitleWithCount name='Unloading' value={unloading_count} />} key='1'>
                  <TripsContainer filters={filters} trip_status='Reported at destination' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='WF.Load' value={truck_current_count + '/' + truck_count} />} key='2'>
                  <WaitingForLoadContainer filters={filters} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Assigned' value={assigned_count} />} key='3'>
                  <TripsContainer filters={filters} trip_status='Assigned' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Confirmed' value={confirmed_count} />} key='4'>
                  <TripsContainer filters={filters} trip_status='Confirmed' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loading' value={loading_count} />} key='5'>
                  <TripsContainer filters={filters} trip_status='Reported at source' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit' value={intransit_count} />} key='6'>
                  <TripsContainer filters={filters} trip_status='Intransit' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit(D)' value={intransit_d_count} />} key='7'>
                  <TripsByDestination filters={filters} intransit trip_status='Intransit' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Unloading(D)' value={unloading_d_count} />} key='8'>
                  <TripsByDestination filters={filters} trip_status='Reported at destination' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loads' value={excess_count} />} key='9'>
                  <ExcessLoad trip_status='Waiting for truck' filters={filters} />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Hold' value={hold_count} />} key='10'>
                  <TripsContainer filters={filters} trip_status='Delivery onhold' />
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
