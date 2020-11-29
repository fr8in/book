import { Row, Col, Card, Tabs,Space, Button,Checkbox} from 'antd'
import { useState } from 'react'
import TripsContainer from './dashboardTripsContainer'
import TripsByDestination from '../../trips/tripsByDestination'
import { CarOutlined,DashboardOutlined,InsertRowAboveOutlined } from '@ant-design/icons'
import ExcessLoad from '../../trips/excessLoad'
import TitleWithCount from '../../common/titleWithCount'
import useShowHide from '../../../hooks/useShowHide'
import CreateExcessLoad from '../../trips/createExcessLoad'
import DASHBOAD_QUERY from './query/dashboardQuery'
import { useQuery } from '@apollo/client'
import _ from 'lodash'
import WaitingForLoadContainer from './waitingForLoadContainer'
import Orders from '../../reports/orders'
import Revenue from '../../reports/revenue'
import Progress from '../../reports/progress'
import moment from 'moment'
import WeeklyBranchTarget from '../../partners/weeklyBranchTarget'
const { TabPane } = Tabs

const DashboardContainer = (props) => {
  const { filters } = props
  const initial = { excessLoad: false,orders:false,Staticticsdata:false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [dndCheck,setDndCheck] = useState(true)

  const variables = {
    now: moment().format('YYYY-MM-DD'),
    regions: (filters.regions && filters.regions.length > 0) ? filters.regions : null,
    branches: (filters.branches && filters.branches.length > 0) ? filters.branches : null,
    cities: (filters.cities && filters.cities.length > 0) ? filters.cities : null,
    truck_type: (filters.types && filters.types.length > 0) ? filters.types : null,
    managers: (filters.managers && filters.managers.length > 0) ? filters.managers : null
  }
  const { loading, data, error } = useQuery(DASHBOAD_QUERY, { variables })

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

    const unloading_aggrigate = _.chain(newData).flatMap('unloading').flatMap('aggregate').value()
    unloading_count = _.sumBy(unloading_aggrigate, 'count')

    const assigned_aggrigate = _.chain(newData).flatMap('assigned').flatMap('aggregate').value()
    assigned_count = _.sumBy(assigned_aggrigate, 'count')

    const confirmed_aggrigate = _.chain(newData).flatMap('confirmed').flatMap('aggregate').value()
    confirmed_count = _.sumBy(confirmed_aggrigate, 'count')

    const loading_aggrigate = _.chain(newData).flatMap('loading').flatMap('aggregate').value()
    loading_count = _.sumBy(loading_aggrigate, 'count')

    const intransit_aggrigate = _.chain(newData).flatMap('intransit').flatMap('aggregate').value()
    intransit_count = _.sumBy(intransit_aggrigate, 'count')

    const intransit_d_aggrigate = _.chain(newData).flatMap('intransit_d').flatMap('aggregate').value()
    intransit_d_count = _.sumBy(intransit_d_aggrigate, 'count')

    const unloading_d_aggrigate = _.chain(newData).flatMap('unloading_d').flatMap('aggregate').value()
    unloading_d_count = _.sumBy(unloading_d_aggrigate, 'count')

    const excess_aggrigate = _.chain(newData).flatMap('excess').flatMap('aggregate').value()
    excess_count = _.sumBy(excess_aggrigate, 'count')

    const hold_aggrigate = _.chain(newData).flatMap('hold').flatMap('aggregate').value()
    hold_count = _.sumBy(hold_aggrigate, 'count')

    const truck_aggrigate = _.chain(newData).flatMap('trucks_total').flatMap('aggregate').value()
    truck_count = _.sumBy(truck_aggrigate, 'count')

    const truck_c_aggrigate = _.chain(newData).flatMap('trucks_current').flatMap('aggregate').value()
    truck_current_count = _.sumBy(truck_c_aggrigate, 'count')
  }

  const truck_tab_disable = !!((filters.branches && filters.branches.length === 0) || filters.branches === null)

const onDndChange = (e) =>{
  setDndCheck(e.target.checked)
}

  return (
    <Row>
      <Col xs={24}>
        {/* Statictics data */}
        {visible.Staticticsdata && <Row gutter={[0, 10]}>
          <Col xs={24} style={{ overflow: 'hidden' }}>
            <Row gutter={10}>
              <Col xs={24} sm={9} md={8}>
                <Orders filters={filters} />
              </Col>
              <Col xs={24} sm={15} md={8}>
                <Revenue filters={filters} />
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Progress />
              </Col>
            </Row>
          </Col>
        </Row>}
        <Row gutter={[0, 10]}>
          <Col xs={24} sm={24}>
            <Card size='small' className='card-body-0 border-top-blue'>
              <Tabs
                defaultActiveKey='2'
                tabBarExtraContent={
                    <Space>
                  <Checkbox defaultChecked={dndCheck} onChange={onDndChange} >DND</Checkbox>
                  <Button size='small' type='primary' shape='circle' icon={<DashboardOutlined />} onClick={() => onShow('Staticticsdata')} /> 
                  <Button size='small' type='primary' shape='circle' icon={<InsertRowAboveOutlined />} onClick={() => onShow('orders')}  /> 
                  <Button size='small' type='primary' shape='circle' icon={<CarOutlined />} onClick={() => onShow('excessLoad')} />
                  </Space>
                }
              >
                <TabPane tab={<TitleWithCount name='Unloading(S)' value={unloading_count} />} key='1'>
                  <TripsContainer filters={filters} trip_status='Reported at destination' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='WF.Load' value={truck_current_count + '/' + truck_count} />} key='2'>
                {truck_tab_disable ? <Row justify='center'> Use Filter to get Data </Row>: <WaitingForLoadContainer filters={filters} dndCheck={dndCheck}/>}
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
                <TabPane tab={<TitleWithCount name='Intransit(S)' value={intransit_count} />} key='6'>
                  <TripsContainer filters={filters} trip_status='Intransit' intransit />
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
                  <TripsContainer filters={filters} trip_status='Intransit halting' />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Col>
      {visible.Staticticsdata && onHide}
      {visible.orders && <WeeklyBranchTarget visible={visible.orders} onHide={onHide} />}
      {visible.excessLoad && <CreateExcessLoad visible={visible.excessLoad} onHide={onHide} />}
    </Row>
  )
}

export default DashboardContainer
