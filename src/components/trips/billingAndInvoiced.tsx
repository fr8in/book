import React from 'react'
import { Modal, Button, Input, Row, Col, Form, Select, message } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { gql, useSubscription } from '@apollo/client'
import SelectUser from '../trips/selectUser'


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



  var customer_info = [];
 
  if (!loading) {
    const { customer } = data
    customer_info = customer[0] ? customer[0] : {}
   
  }

  console.log('TripDetailContainer Error', error)

  const hsn = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].hsn ? customer_info.trips[0].hsn : 'HSN No'
  const gst = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].gst ? customer_info.trips[0].gst : 'GST No'
  const mobile = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].customer_branch && customer_info.trips[0].customer_branch.mobile
  const branch_name = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].customer_branch && customer_info.trips[0].customer_branch.branch_name
  const name = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].customer_branch && customer_info.trips[0].customer_branch.name
  const address = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].customer_branch && customer_info.trips[0].customer_branch.address
  const pincode = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].customer_branch && customer_info.trips[0].customer_branch.pincode
  const user = customer_info && customer_info.customer_users &&  customer_info.customer_users.length > 0 && customer_info.customer_users[0].name 
  const state = customer_info && customer_info.trips && customer_info.trips.length > 0 && customer_info.trips[0].customer_branch && customer_info.trips[0].customer_branch.state && customer_info.trips[0].customer_branch.state.name
console.log('user',user)

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  console.log('customerinfo', customer_info)

  
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
            <Col sm={13}>
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
          <SelectUser value={user} onChange={handleChange} />
          <Row gutter={10}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <p>
                <label>Branch Address</label>
              </p>
              <div className="userBranchList">
                {customer_info.trips ?
                  < div className='loadDetailsRowz'>
                    <p className='text-primary'><b>{branch_name}</b>
                    </p>
                    <p>
                      <span>{name}, </span>{address},
                                            </p>
                    <p> <span>{state}</span>,
                                            </p>
                    <p><span>{pincode}.</span></p>
                  </div> : null}
              </div>
            </Col>

            <Col sm={12}>
              <Form.Item
                label='Contact Number'
                initialValue={mobile}
              >
                <Input value={mobile} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col sm={12}>
              <Form.Item
                label='GST Number'
                initialValue={gst}
              >
                <Input value={gst} />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item
                label='HSN Number'
                initialValue={hsn}
              >
                <Input value={hsn} />
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
