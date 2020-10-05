import React from 'react'
import { Modal, Button, Input, Row, Col, Form, Select, message } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { gql, useSubscription, useMutation } from '@apollo/client'
import Loading from '../common/loading'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import { useState,useContext } from 'react'

const CUSTOMER_BILLING_ADDRESS_FOR_INVOICE = gql`
subscription customer_billing($cardcode: String!, $id: Int!) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    trips(where: {id: {_eq: $id}}) {
      id
      gst
      hsn
      customer_office {
        id
        branch_name
        name
        address
        pincode
        mobile
        state 
      }
    }
    customer_offices{
      id
      name
      branch_name
    }
  }
}`

const UPDATE_TRIP_CUSTOMER_BRANCH = gql`
mutation update_trip_customer_branch($branch_id: Int, $id: Int!,$updated_by: String!) {
  update_trip(_set: {customer_office_id: $branch_id, updated_by:$updated_by}, where: {id: {_eq: $id}}) {
    returning {
      customer_office {
        id
        name
        branch_name
      }
    }
  }
}`

const UPDATE_TRIP_GST_HSN = gql`
mutation update_trip_gst_hsn($gst: String, $hsn:String, $id:Int!,$updated_by:String!){
  update_trip(_set:{gst:$gst, hsn:$hsn,updated_by:$updated_by}, where:{id:{_eq:$id}}){
    returning{
      gst
      hsn
    }
  }
}`

const BillingAndInvoiced = (props) => {
  const { visible, onHide, cardcode, trip_id } = props

  const [disableButton, setDisableButton] = useState(false)
  const context = useContext(userContext)

  const { loading, error, data } = useSubscription(
    CUSTOMER_BILLING_ADDRESS_FOR_INVOICE,
    {
      variables: { cardcode: cardcode, id: trip_id }
    }
  )

  const [update_trip_customer_branch] = useMutation(
    UPDATE_TRIP_CUSTOMER_BRANCH,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  const [update_trip_gst_hsn] = useMutation(
    UPDATE_TRIP_GST_HSN,
    {
      onError (error) {
        setDisableButton(false)
         message.error(error.toString()) },
      onCompleted () { 
        setDisableButton(false)
        message.success('Updated!!') }
    }
  )

  console.log('TripDetailContainer Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }
  const customer = get(_data, 'customer[0]', null)
  const trip = get(customer, 'trips[0]', null)
  const customer_branch = get(trip, 'customer_office', null)
  const customer_branches = get(customer, 'customer_offices', [])

  const onBranchChange = (value, branch) => {
    update_trip_customer_branch({
      variables: {
        id: trip_id,
        branch_id: parseInt(branch.key),
        updated_by: context.email,
      }
    })
  }

  const onGstHsnChange = (form) => {
    setDisableButton(true)
    update_trip_gst_hsn({
      variables: {
        id: trip_id,
        gst: form.gst,
        hsn: form.hsn,
        updated_by: context.email,
      }
    })
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
          <Row justify='start' key='footer' gutter={10}>
            <Col flex='auto'>
              <Input placeholder='Email Address' />
            </Col>
            <Col flex='120px'>
              <Button type='primary'>Send Email</Button>
            </Col>
          </Row>
        ]}
      >
        {loading ? <Loading /> : (
          <Form layout='vertical' onFinish={onGstHsnChange}>
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Row>
                  <Col sm={24}>
                    <Form.Item label='Branch Detail' name='branch_name' initialValue={customer_branch && customer_branch.branch_name}>
                      <Select
                        placeholder='Select Branch'
                        onChange={onBranchChange}
                      >
                        {customer_branches && customer_branches.map(_branch => (
                          <Select.Option key={_branch.id} value={_branch.id}>{_branch.name}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24}>
                    <div className='userBranchList'>
                      {customer_branch ? (
                        <div className='loadDetailsRowz'>
                          <div className='text-primary'><b>{customer_branch.branch_name}</b></div>
                          <div><span>{customer_branch.name}, </span>{customer_branch.address},</div>
                          <div> <span>{customer_branch.state && customer_branch.state.name}</span>,</div>
                          <div><span>Pincode: {customer_branch.pincode}</span></div>
                        </div>) : null}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={24}>
                    <Form.Item
                      label='Contact Number'
                      initialValue={customer_branch && customer_branch.mobile}
                    >
                      <Input value={customer_branch && customer_branch.mobile} disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24}>
                    <Form.Item
                      label='GST Number'
                      name='gst'
                      initialValue={trip.gst}
                    >
                      <Input value={trip.gst} placeholder='GST number' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24}>
                    <Form.Item
                      label='HSN Number'
                      name='hsn'
                      initialValue={trip.hsn}
                    >
                      <Input value={trip.hsn} placeholder='HSN number' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row justify='end'>
              <Button type='primary' icon={<PrinterOutlined />} loading={disableButton} htmlType='submit'> Save & Print Invoice</Button>
            </Row>
          </Form>)}
      </Modal>
    </div>
  )
}

export default BillingAndInvoiced
