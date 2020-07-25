
import { Row, Col, Card, Space, Tag, Tabs, Collapse } from 'antd'
//import data from '../../../../mock/trip/tripDetail'
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

import Loading from '../../common/loading'
import { useSubscription } from '@apollo/client'
import { TRIP_DETAIL_SUBSCRIPTION } from './query/tripDetailSubscription'

const { TabPane } = Tabs
const { Panel } = Collapse

const TripDetailContainer = (props) => {
  const { id } = props
  console.log('tripId', props)
  const { loading, error, data } = useSubscription(
    TRIP_DETAIL_SUBSCRIPTION,
    {
      variables: { id }
    }
  )

  if (loading) return <Loading />
  console.log('TripDetailContainer Data',data)
  console.log('TripDetailContainer Error', error)

  const { trip } = data
  const tripInfo = trip[0] ? trip[0] : { name: 'ID does not exist' }

  const title = (
    <h3>
      <span className='text-primary'>{tripInfo.id}</span>
      <span>:&nbsp;{`${tripInfo.source.name} - ${tripInfo.destination.name}`}&nbsp;</span>
      <small className='text-gray normal'>{tripInfo.truck.truck_type.value}</small> 
     </h3>)
  return (
    <Card
      size='small'
      className='border-top-blue'
      title={title}
      extra={
        <Space>
          <span>Status:</span>
          <Tag className='status'>{tripInfo.trip_status.value}</Tag>
        </Space>
      }
    >
      <Row gutter={10}>
        <Col xs={24} sm={24} md={14}>
          <TripInfo tripInfo={tripInfo} />
          <Collapse accordion className='small mt10'>
            <Panel header='Trip LR' key='1'>
              <TripLr />
            </Panel>
          </Collapse>
          <TripTime tripTime={tripInfo} />
          <Collapse accordion className='small mt10'>
            <Panel header='Customer/Partner - Billing Comment' key='1'>
              <BillingComment />
            </Panel>
          </Collapse>
        </Col>
        <Col xs={24} sm={24} md={10}>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Billing' key='1'>
              <Collapse className='small' defaultActiveKey={['1']}>
                <Panel header='Trip POD' key='1'>
                  <TripPod />
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
                        <b>{23500}</b>
                      </span>
                    </span>
                  }
                  key='1'
                >
                  <Payables />
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
              <TripComment />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  )
}

export default TripDetailContainer
