
import { Row, Col, Card, Space, Tag, Tabs, Collapse } from 'antd'
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

const { TabPane } = Tabs
const { Panel } = Collapse

const TripDetailContainer = (props) => {
  const { trip_id } = props

  const { loading, error, data } = useSubscription(
    TRIP_DETAIL_SUBSCRIPTION,
    {
      variables: { id: trip_id }
    }
  )
  console.log('TripDetailContainer Error', error)
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
                  <Tag className='status'>{get(trip_info, 'trip_status.name', null)}</Tag>
                </Space>
              }
            />
          }
        >
          <Row gutter={10}>
            <Col xs={24} sm={24} md={14}>
              <TripInfo trip_info={trip_info} trip_id={trip_info.id} />
              <Collapse accordion className='small mt10'>
                <Panel header='Trip LR' key='1'>
                  <TripLr trip_info={trip_info} />
                </Panel>
              </Collapse>
              <TripTime trip_info={trip_info} trip_id={trip_info.id} />
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
                  {trip_status_name === 'Delivered' && trip_info.pod_verified_at &&
                    <Collapse accordion className='small box-0 mt10'>
                      <Panel header='Invoice' key='1'>
                        <TripInvoice />
                      </Panel>
                    </Collapse>}
                  {trip_status_id >= '12' && // After invoiced
                    <Collapse accordion className='small mt10'>
                      <Panel header='Invoice Detail' key='1'>
                        <InvoiceDetail
                          ap={trip_info.ap}
                          ar={trip_info.ar}
                          trip_id={trip_id}
                        />
                      </Panel>
                    </Collapse>}
                  <Collapse accordion className='small mt10'>
                    <Panel header='Additional Advance' key='1'>
                      <CreateAdditionalAdvance trip_info={trip_info} />
                      <AdditionalAdvance ad_trip_id={trip_info.id} />
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
                      <Receivables trip_id={trip_id} />
                      <CustomerPayments
                        trip_id={trip_id}
                        status={get(trip_info, 'trip_status.name', null)}
                        cardcode={get(trip_info, 'customer.cardcode', null)}
                        mamul={get(trip_info, 'mamul', 0)}
                        price={get(trip_info, 'partner_price', 0)}
                      />
                    </Panel>
                  </Collapse>
                  <Collapse accordion className='small mt10'>
                    <Panel header='Credit/Debit Note' key='1'>
                      <CreditNote trip_id={trip_id} />
                      <CreditNoteTable />
                    </Panel>
                  </Collapse>
                </TabPane>
                <TabPane tab='Timeline' key='3'>
                  <TripComment trip_id={trip_info.id} trip_status={get(trip_info, 'trip_status.name', null)} />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>)}
    </>
  )
}

export default TripDetailContainer
