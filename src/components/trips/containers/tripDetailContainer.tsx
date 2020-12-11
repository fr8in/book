import { useState, useContext, useEffect } from 'react'
import { Row, Col, Card, Space, Tag, Tabs, Collapse, Tooltip } from 'antd'
import { LockTwoTone } from '@ant-design/icons'
import TripInfo from '../tripInfo'
import TripLr from '../tripLr'
import TripTime from '../tripTime'
import TripComment from '../tripComment'
import BillingComment from '../billingComment'
import TripPod from '../tripPod'
import TripInvoice from '../tripInvoice'
import InvoiceDetail from '../invoiceDetail'
import CreateAdditionalAdvance from '../createAdditionalAdvance'
import AdditionalAdvance from '../additionalAdvance'
import Payables from '../payables'
import Receivables from '../receivables'
import CustomerPayments from '../customerPaymentsContainer'
import CreditNote from '../creditNote'
import CreditNoteTable from '../creditNoteTable'
import { useSubscription } from '@apollo/client'
import { TRIP_DETAIL_SUBSCRIPTION } from './query/tripDetailSubscription'
import DetailPageHeader from '../../common/detailPageHeader'
import get from 'lodash/get'
import Loading from '../../common/loading'
import u from '../../../lib/util'
import isEmpty from 'lodash/isEmpty'
import userContext from '../../../lib/userContaxt'
import Incentive from '../scratchCardInsentive'
import IncentiveTable from '../scratchCardIncentivetable'

const { TabPane } = Tabs
const { Panel } = Collapse

const TripDetailContainer = (props) => {
  const { trip_id } = props

  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.billing_manager, role.billing]
  const access = u.is_roles(edit_access,context)

  const [customerConfirm, setCustomerConfirm] = useState(null)
  const [trip_onHold, setTrip_onHold] = useState(null)
  const [advanceRefetch, setAdvanceRefetch] = useState(false)
  const [creditNoteRefetch, setCreditNoteRefetch] = useState(false)
  const [incentiveRefetch,setIncentiveRefetch] = useState(false)
  const { loading, error, data } = useSubscription(
    TRIP_DETAIL_SUBSCRIPTION,
    {
      variables: { id: trip_id }
    }
  )
  let _data = {}
  if (!loading) {
    _data = data
  }
  const trip_info = get(_data, 'trip[0]', 'ID does not exist')
  const title = (
    <h3>
      <span className='text-primary'>{trip_info.id}</span>
      <span>{` ${get(trip_info, 'source.name', null)} - ${get(trip_info, 'destination.name', null)} `}</span>
      <small className='text-gray normal'>{get(trip_info, 'truck.truck_type.name', null)}</small>
    </h3>)
  const trip_status_name = get(trip_info, 'trip_status.name', null)
  const trip_status_id = get(trip_info, 'trip_status.id', null)
  const before_invoice = (trip_status_id < 12)
  const files = get(trip_info, 'trip_files', [])
  const lr_files = !isEmpty(files) && files.filter(file => file.type === u.fileType.lr)
  const pod_files = !isEmpty(files) && files.filter(file => file.type === u.fileType.pod)
  const customer_confirmation = get(trip_info, 'customer_confirmation', null)
  const loaded = (get(trip_info, 'loaded', null) === 'Yes')
  const lock = get(trip_info, 'transaction_lock', null)

  useEffect(() => {
    setCustomerConfirm(customer_confirmation)
  }, [customer_confirmation])

  return (
    <>
      {loading ? <Loading /> : (
        <Card
          size='small'
          className='border-top-blue'
          title={
            <DetailPageHeader
              title={title}
              extra={
                <Space>
                  {lock &&
                    <Tooltip title='Previous Transaction Pending'>
                      <LockTwoTone twoToneColor='#dc3545' style={{ fontSize: 20 }} />
                    </Tooltip>}
                  <Tag className='status'>{get(trip_info, 'trip_status.name', null)}</Tag>
                </Space>
              }
            />
          }
        >
          {(trip_status_id === 1 || trip_status_id === 7) ? (
            <Row gutter={10}>
              <Col xs={24} sm={24} md={14}>
                <TripInfo trip_info={trip_info} trip_id={trip_info.id} />
              </Col>
              <Space/>
              <Col xs={24} sm={24} md={10}>
              <TripComment trip_id={trip_info.id} trip_status={get(trip_info, 'trip_status.name', null)} />
              </Col>
            </Row>)
            : (
              <Row gutter={10}>
                <Col xs={24} sm={24} md={14}>
                  <TripInfo trip_info={trip_info} trip_id={trip_info.id} />
                  <Collapse accordion className='small mt10'>
                    <Panel header='Trip LR' key='1'>
                      <TripLr
                        trip_info={trip_info}
                        customerConfirm={customerConfirm}
                        setCustomerConfirm={setCustomerConfirm}
                      />
                    </Panel>
                  </Collapse>
                  <TripTime
                    trip_info={trip_info}
                    customerConfirm={customerConfirm}
                    lr_files={lr_files}
                  />
                  <Collapse accordion className='small mt10'>
                    <Panel header='Customer/Partner - Billing Comment' key='1'>
                      <BillingComment trip_id={trip_info.id} trip_info={trip_info} />
                    </Panel>
                  </Collapse>
                </Col>
                <Col xs={24} sm={24} md={10}>
                  <Tabs defaultActiveKey='1'>
                    <TabPane tab='Billing' key='1'>
                      <Collapse className='small' defaultActiveKey={['1']}>
                        <Panel header='Trip POD' key='1'>
                          <TripPod trip_id={trip_info.id} trip_info={trip_info} />
                        </Panel>
                      </Collapse>
                      {trip_status_name === 'Delivered' && trip_info.pod_verified_at && access && !isEmpty(pod_files) && !lock &&
                        <Collapse accordion className='small box-0 mt10'>
                          <Panel header='Invoice' key='1'>
                            <TripInvoice trip_info={trip_info} />
                          </Panel>
                        </Collapse>}
                      {trip_status_id >= 12 && // After invoiced
                        <Collapse accordion className='small mt10'>
                          <Panel header='Invoice Detail' key='1'>
                            <InvoiceDetail
                              ap={trip_info.ap}
                              ar={trip_info.ar}
                              trip_id={trip_id}
                              edit_access={access}
                              lock={lock}
                            />
                          </Panel>
                        </Collapse>}
                      <Collapse accordion className='small mt10'>
                        <Panel header='Additional Advance' key='1'>
                          {before_invoice && loaded && 
                            <CreateAdditionalAdvance trip_info={trip_info} setAdvanceRefetch={setAdvanceRefetch} lock={lock} />}
                          <AdditionalAdvance
                            ad_trip_id={trip_info.id}
                            loaded={loaded}
                            advanceRefetch={advanceRefetch}
                            setAdvanceRefetch={setAdvanceRefetch}
                          />
                        </Panel>
                      </Collapse>
                    </TabPane>
                    <TabPane tab='Payment' key='2'>
                      <Collapse accordion className='small box-0'>
                        <Panel header={<span>Partner - Payables</span>} key='1'>
                          <Payables trip_id={trip_id} />
                        </Panel>
                      </Collapse>
                      <Collapse accordion className='small box-0 mt10'>
                        <Panel header={<span>Customer - Receivables</span>} key='1'>
                          <Receivables trip_id={trip_id} setTrip_onHold={setTrip_onHold} />
                          <CustomerPayments
                            trip_info={trip_info}
                            trip_onHold={trip_onHold}
                            creditNoteRefetch={creditNoteRefetch}
                            setCreditNoteRefetch={setCreditNoteRefetch}
                          />
                        </Panel>
                      </Collapse>
                      <Collapse accordion className='small mt10'>
                        <Panel header='Credit/Debit Note' key='1'>
                          <CreditNote trip_id={trip_id} trip_info={trip_info} />
                          <CreditNoteTable trip_id={trip_id} trip_info={trip_info} setCreditNoteRefetch={setCreditNoteRefetch} />
                        </Panel>
                      </Collapse>
                      <Collapse accordion className='small mt10'>
                        <Panel header='Incentive' key='1'>
                          <Incentive trip_id={trip_id} trip_info={trip_info} />
                          <IncentiveTable trip_id={trip_id} trip_info={trip_info} setIncentiveRefetch={setIncentiveRefetch}  />
                        </Panel>
                      </Collapse>
                    </TabPane>
                    <TabPane tab='Timeline' key='3'>
                      <TripComment trip_id={trip_info.id} trip_status={get(trip_info, 'trip_status.name', null)} />
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>)}
        </Card>)}
    </>
  )
}

export default TripDetailContainer
