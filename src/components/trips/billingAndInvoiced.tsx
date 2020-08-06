import React from 'react'
import { Modal, Button, Input, Row, Col, Form, Select } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Loading from '../common/loading'
import { gql, useSubscription } from '@apollo/client'

const CUSTOMER_BILLING_ADDRESS_FOR_INVOICE = gql`
subscription customerBilling($cardcode: String!, $id: Int!) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    trips(where: {id: {_eq: $id}}){
      id
      gst
      customer_branch{
        id
        branch_name
        name
        address
        pincode
        mobile
        state{
          id
          name
        }
      }
    }
    customer_users {
      id
      name
      mobile
    }
  }
}

`
const BillingAndInvoiced = (props) => {
  const { visible, onHide, cardcode, trip_id } = props

  const { loading, error, data } = useSubscription(
    CUSTOMER_BILLING_ADDRESS_FOR_INVOICE,
    {
      variables: { cardcode: cardcode, id: trip_id }
    }
  )

  if (loading) return <Loading />
  console.log('TripDetailContainer Error', error)

  const { customer } = data
  // const trip_info = trip[0] ? trip[0] : { name: 'ID does not exist' }

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  const title = (
    <div>
    Billing & Invoice - <Link href='/customers/[1d]' as={`/customers/${cardcode}`}><a target='_blank'>{cardcode}</a></Link>
    </div>)
  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        onCancel={onHide}
        footer={[
          <Row justify='start' className='m5' key='footer'>
            <Col>
              <Input placeholder='Email Address' />
            </Col>
            <Col flex='180'>
              <Button> Close </Button>
              <Button type='primary'> Send Email </Button>
            </Col>
          </Row>
        ]}
      >
        <Form layout='vertical'>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='Users'
              >
                <Select defaultValue='Select Users' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='Branch Address'
              >
                <Input placeholder='Address' />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='Contact Number'
              >
                <Input placeholder='Contact Number' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='GST Number'
              >
                <Input placeholder='GST Number' />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='HSN Number'
              >
                <Input placeholder='HSN Number' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row justify='end' className='m5'>
          <Button type='primary' icon={<PrinterOutlined />}> Save & Print Invoice</Button>
        </Row>
      </Modal>
    </div>
  )
}

export default BillingAndInvoiced
