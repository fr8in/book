import React from 'react'
import { Modal, Button, Input, Row, Col, Form, Select } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { gql, useSubscription } from '@apollo/client'

const CUSTOMER_BILLING_ADDRESS_FOR_INVOICE = gql`
subscription customerBilling($cardcode: String!, $id: Int!) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    trips(where: {id: {_eq: $id}}){
      id
      gst
      hsn
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

  var customer_info = [] ;
  
  if (!loading) {
    const { customer } = data
     customer_info = customer[0] ? customer[0] : {}
    
  }
 
  console.log('TripDetailContainer Error', error)
 
  //const { customer } = data
  // const trip_info = trip[0] ? trip[0] : { name: 'ID does not exist' }
  const name = customer_info && customer_info.customer_users &&  customer_info.customer_users.length > 0 && customer_info.customer_users[0].name ? customer_info.customer_users[0].name : 'name'
  console.log('name',name)
 const hsn = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].hsn 
 console.log('hsn',hsn)
 const gst = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].gst ? customer_info.trips[0].gst : 'GST No'
 console.log('gst',gst)
 const mobile = customer_info && customer_info.customer_users &&  customer_info.customer_users.length > 0 && customer_info.customer_users[0].mobile ? customer_info.customer_users[0].mobile : 'Mobile'
 console.log('mobile',mobile)
 const customer_branch = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].customer_branch ? customer_info.trips[0].customer_branch : 'customer_branch No'
 console.log('customer_branch',customer_branch)
  
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  console.log('customerinfo',customer_info)
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
              <Button type='primary' > Send Email </Button>
              <Button > Close </Button>
            </Col>
          </Row>
        ]}
      >
        <Form layout='vertical'>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='Users'
                initialValue={name}
              >
                <Select defaultValue='Select Users' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='Branch Address'
                initialValue={customer_branch}
              >
                <Input placeholder='Address' />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='Contact Number'
                
              >
                <Input defaultValue={mobile} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='GST Number'
                
              >
                <Input defaultValue={gst}/>
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='HSN Number'
                
              >
                <Input defaultValue={hsn}/>
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
