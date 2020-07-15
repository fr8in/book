import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import InlineEdit from '../common/inlineEdit'
import Blacklist from './blacklist';

import data from '../../../mock/customer/customerDetail'
import LabelWithData from '../common/labelWithData'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import customerInfo from '../../../mock/customer/customerDetail';
// import cusMock from '../../../mock/customer/CustomerListMock'
// import ErrorMessage from './ErrorMessage'

export const CUSTOMER_STCODE_QUERY = gql`
  query customers($cardCode: String) {
    customer(where: {cardCode: {_eq: $cardCode}}) {
      id
      PAN
      name
      mobileNo
      cardCode
    }
  }
`

const CustomerInfo = ({ cardCode }) => {

  const onCustomerNameSave = (value) => {
    console.log('value', value)
  }

  const { loading, error, data, } = useQuery(
    CUSTOMER_STCODE_QUERY,
    {
      variables: { cardCode },
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true
    }
  )




  // if (error) return <ErrorMessage message="Error loading posts." />
  if (loading) return <div>Loading</div>
  const { customer } = data
  const customerInfo = customer[0] ? customer[0] : { name: 'ID does not exist' }

  const initial = {
    gst: customerInfo.gst,
    region: customerInfo.region,
    paymentManager: customerInfo.paymentManager,
    onBoardedBy: customerInfo.onBoardedBy
  }

  return (
    <Card
      size='small'
      title={<InlineEdit
        text={customerInfo.name}
        //onSetText={text => text}
        onSubmit={onCustomerNameSave}
      />}
      extra={<Blacklist />}
    >
      <Row gutter={[10, 10]}>
        <Col sm={13}>

          <Row>
            <Col xs={24} sm={24} md={12}>
              <LabelWithData label='PAN' data={customerInfo.PAN} labelSpan={10} dataSpan={14} />
              <LabelWithData label='LR' data={customerInfo.lr} labelSpan={10} dataSpan={14} />
              <LabelWithData
                label='GST No'
                data={<InlineEdit text={customerInfo.gst} objKey='gst'
                //onSetText={text => setValue({ ...value, gst: text })} 
                //onSubmit={editSubmit} 
                />}
                labelSpan={10}
                dataSpan={14}
              />
              <LabelWithData label='Id' data={customerInfo.cardCode} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Virtual Account' data={customerInfo.virtualAccount} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Mobile No' data={customerInfo.mobileNo} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Region' data={customerInfo.region} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Payment Manager' data={customerInfo.paymentManager} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Receivable Days' data={customerInfo.receivableDays} labelSpan={10} dataSpan={14} />
              <LabelWithData label='OnBoarded By' data={customerInfo.onBoardedBy} labelSpan={10} dataSpan={14} />
            </Col>
            <Col xs={24} sm={24} md={12}>
            </Col>
          </Row>     </Col>
        <Col xs={11} />
      </Row>
    </Card>
  )
}

export default CustomerInfo
