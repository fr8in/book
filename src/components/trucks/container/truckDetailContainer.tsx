import { useState } from 'react'
import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import TruckTimeline from '../truckTimeline'
import { Row, Col, Button, Card, Divider, Space, Tag, Tabs, message } from 'antd'
import { CommentOutlined, SnippetsOutlined } from '@ant-design/icons'
import CreatePo from '../../trips/createPo'
import DetailPageHeader from '../../common/detailPageHeader'
import TruckType from '../../trucks/truckType'
import TruckNo from '../../trucks/truckNo'
import useShowHide from '../../../hooks/useShowHide'
import TruckComment from '../../trucks/truckComment'

import { gql, useSubscription, useMutation } from '@apollo/client'

const TRUCK_DETAIL_SUBSCRIPTION = gql`
  subscription trucks($truck_no: String,$trip_status_id:[Int!]) {
    truck(where: {truck_no: {_eq: $truck_no}}) {
        id
        truck_no
        length
        breadth
        height
        driver{
          id
          mobile
        }
        truck_files{
            id
             type
             file_path
             folder
       }
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
          partner_files{
            id
               type
               file_path
               folder
         }
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
  const admin = true
  const [subTabKey, setSubTabKey] = useState('1')

  const initial = { commment: false, poModal: false }
  const { visible, onShow, onHide } = useShowHide(initial)

  const [updateStatus] = useMutation(
    INSERT_TRUCK_REJECT_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
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

  var _data = {}

  if (!loading) {
    _data = data
  }
  const truck_info = _data && _data.truck && _data.truck.length > 0 ? _data.truck[0] : { name: 'ID does not exist' }
  
  const status_check = truck_info && truck_info.truck_status && truck_info.truck_status.name === 'Deactivated'

  const partner_id = truck_info && truck_info.partner && truck_info.partner.id 
  
 

  const onSubmit = (status_check) => {
    console.log('truck_id', truck_info.id)
    updateStatus({
      variables: {
        truck_status_id: status_check ? 1 : 7,
        id: truck_info.id
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
                  id={truck_info.id}
                  truck_no={truck_info.truck_no}
                  loading={loading}
                />
              </h3>
              <Divider type='vertical' />
              <h4>
                <TruckType
                  truckType={truck_info.truck_type && truck_info.truck_type.name}
                  truckTypeId={truck_info.truck_type && truck_info.truck_type.id}
                  truck_no={truck_info.truck_no}
                />
              </h4>
            </Space>
          }
          extra={
            <Space>
              <Button type='primary' shape='circle' onClick={() => onShow('poModal')} icon={<SnippetsOutlined />} />
              <Tag className='status'>{truck_info && truck_info.truck_status && truck_info.truck_status.name}</Tag>
            </Space>
          }
        />
      }
    >
      <Truck truck_info={truck_info} />
      <Row>
        <Col xs={24}>
          <Card size='small' className='card-body-0 border-top-blue'>
            <Tabs
              defaultActiveKey='1'
              onChange={subTabChange}
              tabBarExtraContent={
                <span>
                  {subTabKey === '3' &&
                    <Button size='middle' shape='circle' icon={<CommentOutlined />} onClick={() => onShow('comment')} />}
                </span>
              }
            >
              <TabPane tab='Details' key='1'>
                <Row>
                  <Col xs={24} className='p20'>
                    <TruckInfo truck_info={truck_info} loading={loading} id={truck_info.id}  partner_id={partner_id} />
                    <Divider />
                    <Documents truck_id={truck_info.id}  partner_id={partner_id} truck_info={truck_info}/>
                    <Divider />
                    <Row>
                      <Col span={8}>
                        <Button size='small' danger={admin && !status_check} onClick={() => onSubmit(status_check)}>  {status_check ? 'Re-Activate' : 'De-Activate'} </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab='Trips' key='2'>

                <TripDetail trip trips={truck_info.trips} loading={loading} />

              </TabPane>
              <TabPane tab='Timeline' key='3'>
                <Row>
                  <Col xs={24} className='p20'>
                    <TruckTimeline comments={truck_info.truck_comments} />
                  </Col>
                </Row>

              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
      {visible.comment && <TruckComment visible={visible.comment} onHide={onHide} id={truck_info.id} truck_status={truck_info && truck_info.truck_status && truck_info.truck_status.name}/>}
      {visible.poModal && <CreatePo visible={visible.poModal} onHide={() => onHide()} />}
    </Card>
  )
}
export default TruckDetailContainer
