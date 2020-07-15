import { useState } from 'react'
import { Row, Col, Card } from 'antd'
import InlineEdit from '../common/inlineEdit'
import Blacklist from './blacklist';

import data from '../../../mock/customer/customerDetail'
import LabelWithData from '../common/labelWithData'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
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
  const constomerInfo = customer[0] ? customer[0] : { name: 'ID does not exist' }
  const [storedHeading, setStoredHeading] = useState(
    constomerInfo.name
  )
  const initial = {
    gst: constomerInfo.gst,
    region: constomerInfo.region,
    paymentManager: constomerInfo.paymentManager,
    onBoardedBy: constomerInfo.onBoardedBy
  }
  const [value, setValue] = useState(initial)
  const editSubmit = (objKey, text) => {
    setValue({ ...value, [objKey]: text })
  }
  return (
    <Card
      size='small'
      title={<InlineEdit
        text={storedHeading}
        onSetText={text => setStoredHeading(text)}
        onSubmit={onCustomerNameSave}
      />}
      extra={<Blacklist />}
    >
      <Row gutter={[10, 10]}>
        <Col sm={13}>

          <Row>
            <Col xs={24} sm={24} md={12}>
              <LabelWithData label='PAN' data={constomerInfo.PAN} labelSpan={10} dataSpan={14} />
              <LabelWithData label='LR' data={constomerInfo.lr} labelSpan={10} dataSpan={14} />
              <LabelWithData
                label='GST No'
                data={<InlineEdit text={value.gst} objKey='gst' onSetText={text => setValue({ ...value, gst: text })} onSubmit={editSubmit} />}
                labelSpan={10}
                dataSpan={14}
              />
              <LabelWithData label='Id' data={constomerInfo.cardCode} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Virtual Account' data={constomerInfo.virtualAccount} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Mobile No' data={constomerInfo.mobileNo} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Region' data={constomerInfo.region} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Payment Manager' data={constomerInfo.paymentManager} labelSpan={10} dataSpan={14} />
              <LabelWithData label='Receivable Days' data={constomerInfo.receivableDays} labelSpan={10} dataSpan={14} />
              <LabelWithData label='OnBoarded By' data={constomerInfo.onBoardedBy} labelSpan={10} dataSpan={14} />
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
