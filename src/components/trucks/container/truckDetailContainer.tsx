import { useState } from 'react'
import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import Timeline from '../truckTimeline'
import { Row, Col, Button, Card, Divider, Space, Tag, Tabs , message } from 'antd'
import {  CommentOutlined } from '@ant-design/icons'
import AssignTrip from '../assignTrip'
import DetailPageHeader from '../../common/detailPageHeader'
import TruckType from '../../../components/trucks/truckType'
import TruckNo from '../../../components/trucks/truckNo'
import useShowHide from '../../../hooks/useShowHide'
import CommentModal from '../../../components/trucks/commentModal'

import { gql, useSubscription ,useMutation} from '@apollo/client'

const TRUCK_DETAIL_SUBSCRIPTION = gql`
  subscription trucks($truck_no: String,$trip_status_id:[Int!]) {
    truck(where: {truck_no: {_eq: $truck_no}}) {
        id
        truck_no
        length
        breadth
        height
        truck_status{
          id
          name
        }
        truck_comments{
          id
          topic
          description
          created_at
          created_by_id
        } 
        truck_type{
          name
        }
        city{
          name
         }
        partner {
          id
          name
          partner_users(limit:1 , where:{is_admin:{_eq:true}}){
            mobile
          }
          cardcode
        }
        trips (where: {trip_status_id: {_in: $trip_status_id}}) {
          id
          order_date
          km
          avg_km_day
          source{
            name
          }
          destination{
            name
          }
          trip_status{
            name
          }
        }
        
      }
     
    }
`

const INSERT_TRUCK_REJECT_MUTATION = gql`
mutation truckReject ( $truck_status_id:Int,$id:Int! ){
  update_truck_by_pk(pk_columns: {id: $id}, _set: {truck_status_id:$truck_status_id}) {
    id
  }
}
`



const TabPane = Tabs.TabPane
const tripStatusId = [2, 3, 4, 5, 6]

const TruckDetailContainer = (props) => {
  const { truckNo } = props
  const  admin = true
  const [subTabKey, setSubTabKey] = useState('1')

  const initial = { commment: false}
  const { visible, onShow, onHide } = useShowHide(initial)

  const [updateStatus] = useMutation(
    INSERT_TRUCK_REJECT_MUTATION,
    {
      onError(error) { message.error(error.toString()) },
      onCompleted() { message.success('Updated!!') }
    }
  )

  const subTabChange = (key) => {
    setSubTabKey(key)
  }
  console.log('truck Id', truckNo)

  const { loading, error, data } = useSubscription(
    TRUCK_DETAIL_SUBSCRIPTION,
    {
      variables: { truck_no: truckNo, trip_status_id: tripStatusId }
    }
  )

  console.log('TruckDetailContainer Error', error)

  var truckInfo = {}

  if (!loading) {
    const { truck } = data
    truckInfo = truck[0] ? truck[0] : { name: 'ID does not exist' }
  }

  const status_check = truckInfo && truckInfo.truck_status && truckInfo.truck_status.name === 'Deactivated'

  const onSubmit = (status_check) => {
    console.log("truck_id",truckInfo.id)
    updateStatus({
      variables: {
        truck_status_id: status_check ? 1 : 7,
        id:truckInfo.id
      }
    })
  }

  
  

  return (
    <Card
      size='small'
      className='border-top-blue'
      title={
        <DetailPageHeader
          title={
            <Space>
              <h3>
                <TruckNo
                  id={truckInfo.id}
                  truck_no={truckInfo.truck_no}
                />
              </h3>
              <Divider type='vertical' />
              <h4>
                <TruckType
                  truckType={truckInfo.truck_type && truckInfo.truck_type.name}
                  truckTypeId={truckInfo.truck_type && truckInfo.truck_type.id}
                  truck_no={truckInfo.truck_no}
                />
              </h4>
            </Space>
          }
          extra={
            <Space>
              <AssignTrip />
              <Tag className='status'>{truckInfo && truckInfo.truck_status && truckInfo.truck_status.name}</Tag>
            </Space>
          }
        />
      }
    >
      <Truck truckInfo={truckInfo} />
      <Row>
        <Col xs={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs defaultActiveKey='1' 
            onChange={subTabChange} type='card'
            tabBarExtraContent={
              <span>
                {subTabKey === '3' &&
                      <Button size='middle' shape='circle' icon={<CommentOutlined />} onClick={() => onShow('comment')} />   
                       } </span>
                }>

              <TabPane tab='Details' key='1'>
                <Row>
                  <Col xs={24} className='p20'>
                    <TruckInfo truck_info = {truckInfo} id={truckInfo.id}/>
                    <Divider />
                    <Documents truck_id = {truckInfo.id}/>
                    <Divider />
                    <Row>
                <Col span={8} >  
               <Button size= "small" danger={admin && !status_check} onClick={()=>onSubmit(status_check)}>  {status_check ? 'Re-Activate' :  'De-Activate' } </Button> 
                
                </Col>
                  <Col span={8} offset={8} style={{textAlign: "right"}}>
                         <Space>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                        <Button>Cancel</Button>
                      </Space>
                   </Col>
                 </Row>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab='Trips' key='2'>
              
                <TripDetail trip trips={truckInfo.trips} loading={loading} />
                
              </TabPane>
              <TabPane tab='Timeline' key='3'>
                <Row>
                  <Col xs={24} className='p20'>
                    <Timeline comments={truckInfo.truck_comments}/>
                  </Col>
                </Row>
            
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
     {visible.comment && <CommentModal visible={visible.comment} onHide={onHide} id={truckInfo.id}/>}

    </Card>
  )
}
export default TruckDetailContainer
