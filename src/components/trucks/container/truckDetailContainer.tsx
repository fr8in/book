import userContext from '../../../lib/userContaxt'
import { useState, useContext } from 'react'
import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import TruckTimeline from '../truckTimeline'
import { Row, Col, Button, Card, Divider, Space, Tag, Tabs, message, Tooltip } from 'antd'
import { CommentOutlined, SnippetsOutlined } from '@ant-design/icons'
import DetailPageHeader from '../../common/detailPageHeader'
import TruckType from '../../trucks/truckType'
import TruckNo from '../../trucks/truckNo'
import useShowHide from '../../../hooks/useShowHide'
import TruckComment from '../../trucks/truckComment'
import CreatePo from '../../trips/createPo'
import get from 'lodash/get'
import u from '../../../lib/util'
import isEmpty from 'lodash/isEmpty'
import Loading from '../../common/loading'

import { gql, useSubscription, useMutation } from '@apollo/client'

const TRUCK_DETAIL_SUBSCRIPTION = gql`
  subscription truck_detail($truck_no: String,$trip_status_id:[Int!]) {
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
        truck_files {
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
          created_by
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
          partner_status{
            id
            name
          }
        }
        trips {
          id
          order_date
          created_at
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
mutation truck_reject ( $truck_status_id:Int,$id:Int!,$updated_by: String! ){
  update_truck_by_pk(pk_columns: {id: $id}, _set: {truck_status_id:$truck_status_id,updated_by:$updated_by}) {
    id
  }
}
`

const TabPane = Tabs.TabPane
const tripStatusId = [2, 3, 4, 5, 6]

const TruckDetailContainer = (props) => {
  const { truckNo } = props
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = !isEmpty(edit_access) ? context.roles.some(r => edit_access.includes(r)) : false

  const [subTabKey, setSubTabKey] = useState('1')

  const initial = { commment: false }
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
  const truck_info = get(_data, 'truck[0]', { name: 'ID does not exist' })

  const status_check = truck_info && truck_info.truck_status && truck_info.truck_status.name === 'Deactivated'

  const partner_id = truck_info && truck_info.partner && truck_info.partner.id

  const onSubmit = (status_check) => {
    console.log('truck_id', truck_info.id)
    updateStatus({
      variables: {
        truck_status_id: status_check ? 5 : 6,
        id: truck_info.id,
        updated_by: context.email
      }
    })
  }

  const truck_status = get(truck_info, 'truck_status.name', null)
  const partner_status = get(truck_info, 'partner.partner_status.name', null)

  return (
    loading ? <Loading /> : (
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
                    truckType={get(truck_info, 'truck_type.name', null)}
                    truckTypeId={get(truck_info, 'truck_type.id', null)}
                    truck_no={get(truck_info, 'truck_no', null)}
                  />
                </h4>
              </Space>
            }
            extra={
              <Space>
                <Button type='primary' disabled={!(truck_status === 'Waiting for Load' && partner_status === 'Active')} shape='circle' onClick={() => onShow('poModal')} icon={<SnippetsOutlined />} />
                <Tooltip title={`Id: ${get(truck_info, 'id', null)}`}><Tag className='status'>{get(truck_info, 'truck_status.name', null)}</Tag></Tooltip>
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
                      <Button shape='circle' icon={<CommentOutlined />} onClick={() => onShow('comment')} />}
                  </span>
                }
              >
                <TabPane tab='Details' key='1'>
                  <Row>
                    <Col xs={24} className='p20'>
                      <TruckInfo truck_info={truck_info} loading={loading} id={truck_info.id} partner_id={partner_id} />
                      <Divider />
                      <Documents truck_id={truck_info.id} partner_id={partner_id} truck_info={truck_info} />
                      <Divider />
                      {access &&
                        <Row>
                          <Col span={8}>
                            <Button danger onClick={() => onSubmit(status_check)}>  {status_check ? 'Re-Activate' : 'De-Activate'} </Button>
                          </Col>
                        </Row>}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab='Trips' key='2'>
                  <TripDetail truckPage trips={truck_info.trips} loading={loading} />
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
        {visible.comment && <TruckComment visible={visible.comment} onHide={onHide} id={truck_info.id} truck_status={truck_info && truck_info.truck_status && truck_info.truck_status.name} />}
        {visible.poModal && <CreatePo visible={visible.poModal} onHide={onHide} truck_id={truck_info.id} />}
      </Card>)
  )
}
export default TruckDetailContainer
