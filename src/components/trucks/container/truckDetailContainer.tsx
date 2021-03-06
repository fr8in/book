import userContext from '../../../lib/userContaxt'
import { useState, useContext } from 'react'
import TruckInfo from '../truckInfo'
import Documents from '../truckDocuments'
import TripDetail from '../../trips/tripsByStages'
import Truck from '../truck'
import TruckTimeline from '../truckTimeline'
import { Row, Col, Button, Card, Divider, Space, Tag, Tabs, message, Tooltip ,Checkbox} from 'antd'
import { CommentOutlined, SnippetsOutlined } from '@ant-design/icons'
import DetailPageHeader from '../../common/detailPageHeader'
import TruckType from '../../trucks/truckType'
import TruckNo from '../../trucks/truckNo'
import useShowHide from '../../../hooks/useShowHide'
import TruckComment from '../../trucks/truckComment'
import CreatePo from '../../trips/createPo'
import TruckDeactivation from '../truckDeactivationComment' 
import get from 'lodash/get'
import u from '../../../lib/util'
import isEmpty from 'lodash/isEmpty'
import Loading from '../../common/loading'
import SingleTripDeactivation from '../singleTripDeactivation'

import { gql, useSubscription } from '@apollo/client'

const TRUCK_DETAIL_SUBSCRIPTION = gql`
  subscription truck_detail($truck_no: String,$trip_status_id:[Int!]) {
    truck(where: {truck_no: {_eq: $truck_no}}) {
        id
        truck_no
        single_trip
        length
        breadth
        height
        pan
        insurance_expiry_at
        loading_memo
        driver{
          id
          mobile
        }
        truck_files {
            id
              type
              file_path
              folder
              financial_year
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
          pan
          partner_files{
            id
               type
               file_path
               folder
               financial_year
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



const TabPane = Tabs.TabPane
const tripStatusId = [2, 3, 4, 5, 6]

const TruckDetailContainer = (props) => {
  const { truckNo } = props
  const admin = true
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.partner_manager, role.onboarding]
  const access = u.is_roles(edit_access,context)
  const [checked, setChecked] = useState(false)

  const [subTabKey, setSubTabKey] = useState('1')

  const initial = { commment: false,deactivate_comment: false,dectivate: false }
  const { visible, onShow, onHide } = useShowHide(initial)
  const subTabChange = (key) => {
    setSubTabKey(key)
  }

  const onCheck=(e) => {
    setChecked(e.target.checked)
  }

const { loading, error, data } = useSubscription(
    TRUCK_DETAIL_SUBSCRIPTION,
    {
      variables: { truck_no: truckNo, trip_status_id: tripStatusId }
    }
  )



  var _data = {}

  if (!loading) {
    _data = data
  }
  const truck_info = get(_data, 'truck[0]', { name: 'ID does not exist' })

  const status_check = truck_info && truck_info.truck_status && truck_info.truck_status.name === 'Deactivated'

  const partner_id = truck_info && truck_info.partner && truck_info.partner.id

 

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
                    truck_id={truck_info.id}
                    truck_no={get(truck_info, 'truck_no', null)}
                  />
                </h4>
              </Space>
            }
            extra={
              <Space>
                {truck_status === 'Waiting for Load' && partner_status === 'Active' ?
                  <Button type='primary' shape='circle' onClick={() => onShow('poModal')} icon={<SnippetsOutlined />} />
                  : <Tooltip title={`Partner Status: ${get(truck_info, 'partner.partner_status.name', null)}`}>
                    <Button type='primary' shape='circle' icon={<SnippetsOutlined />} block danger />
                  </Tooltip>
                }
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
                className='tabExtraFix'
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
                    <Documents truck_id={truck_info.id} partner_id={partner_id} truck_info={truck_info} />
                      <Divider />
                      {access &&
                        <Row>
                           <Space>
                          <Col >
                            <Button danger={admin && !status_check} onClick={() => onShow('deactivate_comment')}>  {status_check ? 'Re-Activate' : 'De-Activate'} </Button>
                          </Col>
                          {!status_check && 
                          <Col>
                      <Checkbox onClick={() => onShow('dectivate')} onChange={onCheck} checked={truck_info.single_trip}  value='value'>Single Trip</Checkbox>
                          </Col>}
                          </Space>
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
        {visible.deactivate_comment && <TruckDeactivation visible={visible.deactivate_comment} onHide={onHide} truck_info={truck_info} />}
        {visible.dectivate && <SingleTripDeactivation visible={visible.dectivate} onHide={onHide} truck_info={truck_info} checked={checked} />}
      </Card>)
  )
}
export default TruckDetailContainer
