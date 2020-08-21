
import { Row, Col, Card, Space, Tag, Tabs, Collapse } from 'antd'
// import data from '../../../../mock/trip/tripDetail'
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
import CustomerPayments from '../customerPayments'
import CreditNote from '../creditNote'
import CreditNoteTable from '../creditNoteTable'
import { useSubscription } from '@apollo/client'
import { TRIP_DETAIL_SUBSCRIPTION } from './query/tripDetailSubscription'
import DetailPageHeader from '../../common/detailPageHeader'

const { TabPane } = Tabs
const { Panel } = Collapse

const TripDetailContainer = (props) => {
  const { trip_id } = props
  console.log('tripId', props)
  const { loading, error, data } = useSubscription(
    TRIP_DETAIL_SUBSCRIPTION,
    {
      variables: { id: trip_id }
    }
  )
  var trip = []
  if (!loading) {
    trip = data.trip
  }
  console.log('TripDetailContainer Error', error)
  const trip_info = trip[0] ? trip[0] : { name: 'ID does not exist' }
console.log('trip_info',trip_info)
  const title = (
    <h3>
      <span className='text-primary'>{trip_info.id}</span>
      <span>{` ${trip_info.source && trip_info.source.name} - ${trip_info.source && trip_info.destination.name} `}</span>
      <small className='text-gray normal'>{trip_info.truck && trip_info.truck.truck_type && trip_info.truck.truck_type.name}</small>
    </h3>)
  return (
    <Card
      size='small'
      className='border-top-blue'
      title={
        <DetailPageHeader
          title={title}
          extra={
            <Space>
              <Tag className='status'>{trip_info.trip_status && trip_info.trip_status.name}</Tag>
            </Space>
          }
        />
      }
    >
      <Row gutter={10}>
        <Col xs={24} sm={24} md={14}>
          <TripInfo trip_info={trip_info} trip_price={trip_info && trip_info.trip_prices} trip_id={trip_info.id}/>
          <Collapse accordion className='small mt10'>
            <Panel header='Trip LR' key='1'>
              <TripLr trip_info={trip_info} />
            </Panel>
          </Collapse>
          <TripTime trip_info={trip_info} trip_id={trip_info.id}/>
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
              <Collapse accordion className='small box-0 mt10'>
                <Panel header='Invoice' key='1'>
                  <TripInvoice />
                </Panel>
              </Collapse>
              <Collapse accordion className='small mt10'>
                <Panel header='Invoice Detail' key='1'>
                  <InvoiceDetail />
                </Panel>
              </Collapse>
              <Collapse accordion className='small mt10'>
                <Panel header='Additional Advance' key='1'>
                  <CreateAdditionalAdvance />
                  <AdditionalAdvance />
                </Panel>
              </Collapse>
            </TabPane>
            <TabPane tab='Payment' key='2'>
              <Collapse accordion className='small box-0'>
                <Panel
                  header={
                    <span>Partner - Payables
                      <span className='pull-right'>
                        <b>{23000}</b>
                      </span>
                    </span>
                  }
                  key='1'
                >
                  <Payables trip_pay={trip_info} />
                </Panel>
              </Collapse>
              <Collapse accordion className='small box-0 mt10'>
                <Panel
                  header={
                    <span>Customer - Receivables
                      <span className='pull-right'>
                        <b>{23500}</b>
                      </span>
                    </span>
                  }
                  key='1'
                >
                  <Receivables />
                  <CustomerPayments />
                </Panel>
              </Collapse>
              <Collapse accordion className='small mt10'>
                <Panel header='Credit/Debit Note' key='1'>
                  <CreditNote />
                  <CreditNoteTable />
                </Panel>
              </Collapse>
            </TabPane>
            <TabPane tab='Timeline' key='3'>
              <TripComment trip_id={trip_info.id} comments={trip_info.trip_comments} trip_status={trip_info.trip_status && trip_info.trip_status.name}/>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  )
}

export default TripDetailContainer
