import { Row, Col, Card, Tabs,Space, Button,Checkbox,Badge} from 'antd'
import { useState } from 'react'
import TripsContainer from './dashboardTripsContainer'
import TripsByDestination from '../../trips/tripsByDestination'
import { CarOutlined,DashboardOutlined,InsertRowAboveOutlined } from '@ant-design/icons'
import ExcessLoad from '../../trips/excessLoad'
import TitleWithCount from '../../common/titleWithCount'
import useShowHide from '../../../hooks/useShowHide'
import CreateExcessLoad from '../../trips/createExcessLoad'
import DASHBOAD_QUERY from './query/dashboardQuery'
import {gql, useQuery,useSubscription } from '@apollo/client'
import _, {get,  sumBy } from 'lodash'
import WaitingForLoadContainer from './waitingForLoadContainer'
import Orders from '../../reports/orders'
import Revenue from '../../reports/revenue'
import Progress from '../../reports/progress'
import moment from 'moment'
import WeeklyBranchTarget from '../../partners/weeklyBranchTarget'
import AdvancePending from '../../trips/dashboardAdvancePending'
import {filterContext} from '../../../context'
import { useContext } from 'react'


const { TabPane } = Tabs

const WEEKLY_TARGET_QUERY = gql`
subscription monthly($week1: Int!, $year1: Int!,$branches:[Int!]) {
  analytics_weekly_booking_aggregate(where: {_and: 
   {
     branch_id: {_in: $branches}, 
     week: {_eq: $week1},
     year: {_eq: $year1}
   
   }}) {
   aggregate {
     sum {
       trip_actual
       amount
     }
   }
 }
}
`

const DashboardContainer = (props) => {
  const initial = { excessLoad: false,orders:false,Staticticsdata:false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const [dndCheck,setDndCheck] = useState(false)
  const date = new Date(new Date().getFullYear(), 0, 1);
  const {state} = useContext(filterContext)

  const fr8Date=moment().add(1,'days');
  const cw = moment(fr8Date).format('WW yyyy').split(' ') // Current Week

  const week = [parseInt(cw[0], 10)]// will get cw
  const year = [parseInt(cw[1], 10)]// will get 3 years of cw 

  const { loading:weekly_target_loading, data:weekly_target_data, error:weekly_target_error } = useSubscription(
    WEEKLY_TARGET_QUERY,
    {
      variables: {
        week1: week[0],
        branches: (state.branches && state.branches.length > 0) ? state.branches : null,
        year1: year[0]
      }
    }
  )

  console.log('WeeklyBranchTargetCount Error', weekly_target_error)

  let _data = {}
  if (!weekly_target_loading) {
    _data = weekly_target_data
  }

  const w1_actual = get(_data,'analytics_weekly_booking_aggregate.aggregate.sum.trip_actual',null)
  const weekly_gmv =  get(_data, 'analytics_weekly_booking_aggregate.aggregate.sum.amount',null) / 100000
  
  const variables = {
    now: moment().format('YYYY-MM-DD'),
    yearStart: moment(date).format('YYYY-MM-DD'),
    regions: (state.regions && state.regions.length > 0) ? state.regions : null,
    branches: (state.branches && state.branches.length > 0) ? state.branches : null,
    cities: (state.cities && state.cities.length > 0) ? state.cities : null,
    truck_type: (state.types && state.types.length > 0) ? state.types : null,
    managers: (state.managers && state.managers.length > 0) ? state.managers : null,
    speed: (state.speed && state.speed.length > 0) ? state.speed : null,
    dnd: !dndCheck
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
  let adv_pending_count = 0

  if (!loading) {
    const newData = { data }

    const adv_pending_aggrigate = _.chain(newData).flatMap('adv_pending').flatMap('aggregate').value()
    adv_pending_count = _.sumBy(adv_pending_aggrigate, 'count')

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

  const truck_tab_disable = !!((state.branches && state.branches.length === 0) || state.branches === null)

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
                <Orders  />
              </Col>
              <Col xs={24} sm={15} md={8}>
                <Revenue  />
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
                className='tabExtraFix'
                defaultActiveKey='2'
                tabBarExtraContent={
                    <Space>
                  <Checkbox defaultChecked={dndCheck} onChange={onDndChange} >DND</Checkbox>
                  <Badge count={Math.round(weekly_gmv)} className='badgeCount'   overflowCount={1000}>
                  <Button size='small' type='primary' shape='circle' icon={<DashboardOutlined />}  onClick={() => onShow('Staticticsdata')} /> 
                  </Badge>
                  <Badge count={w1_actual} className='badgeCount'   overflowCount={1000}>
                  <Button size='small' type='primary' shape='circle' icon={<InsertRowAboveOutlined />} onClick={() => onShow('orders')} /> 
                  </Badge>
                  <Button size='small' type='primary' shape='circle' icon={<CarOutlined />} onClick={() => onShow('excessLoad')} />
                  </Space>
                }
              >
                <TabPane tab={<TitleWithCount name='Unloading(S)' value={unloading_count} />} key='1'>
                  <TripsContainer  trip_status='Reported at destination' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='WF.Load' value={truck_current_count + '/' + truck_count} />} key='2'>
                {truck_tab_disable ? <Row justify='center'> Use Filter to get Data </Row>: <WaitingForLoadContainer  dndCheck={dndCheck}/>}
                </TabPane>
                <TabPane tab={<TitleWithCount name='Assigned' value={assigned_count} />} key='3'>
                  <TripsContainer   trip_status='Assigned' partner_region_filter />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Confirmed' value={confirmed_count} />} key='4'>
                  <TripsContainer   trip_status='Confirmed' partner_region_filter/>
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loading' value={loading_count} />} key='5'>
                  <TripsContainer   trip_status='Reported at source' partner_region_filter/>
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit(S)' value={intransit_count} />} key='6'>
                  <TripsContainer  trip_status='Intransit' intransit />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Intransit(D)' value={intransit_d_count} />} key='7'>
                  <TripsByDestination  intransit trip_status='Intransit' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Unloading(D)' value={unloading_d_count} />} key='8'>
                  <TripsByDestination  trip_status='Reported at destination' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Loads' value={excess_count} />} key='9'>
                  <ExcessLoad trip_status='Waiting for truck'  />
                </TabPane>
                <TabPane tab={<TitleWithCount name='Hold' value={hold_count} />} key='10'>
                  <TripsContainer  trip_status='Intransit halting' />
                </TabPane>
                <TabPane tab={<TitleWithCount name='ADV.Pending' value={adv_pending_count} />} key='11'>
                  <AdvancePending  />
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

