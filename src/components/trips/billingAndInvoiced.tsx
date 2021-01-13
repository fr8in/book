import { useState, useContext } from 'react'
import { Modal, Button, Input, Row, Col, Form, Select, message } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { gql, useSubscription, useMutation, useLazyQuery } from '@apollo/client'
import Loading from '../common/loading'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import { isEmpty } from 'lodash'

const CUSTOMER_BILLING_ADDRESS_FOR_INVOICE = gql`
subscription customer_billing($cardcode: String!, $id: Int!) {
  customer(where: {cardcode: {_eq: $cardcode}}) {
    id
    name
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
        city
        state 
      }
    }
    customer_offices{
      id
      branch_name
      name
      address
      pincode
      mobile
      city
      state 
    }
  }
}`

const GET_INVOICE_PDF = gql`
query invoice_report($trip_id: Int!) {
  invoice_report(trip_id: $trip_id)
}`

const UPDATE_TRIP_CUSTOMER_BRANCH = gql`
mutation update_trip_customer_branch($branch_id: Int, $id: Int!, $updated_by: String!, $description: String!) {
  update_trip(_set: {customer_office_id: $branch_id, updated_by: $updated_by}, where: {id: {_eq: $id}}) {
    returning {
      customer_office_id
    }
  }
  insert_trip_comment(objects: {topic: "Billing Address Changed", description: $description, created_by: $updated_by, trip_id: $id}) {
    returning {
      id
    }
  }
}`

const UPDATE_TRIP_GST_HSN = gql`
mutation update_trip_gst_hsn($gst: String, $hsn:String, $id:Int!,$updated_by:String!, $customer_office_id: Int!){
  update_trip(_set:{gst:$gst, hsn:$hsn,updated_by:$updated_by, customer_office_id: $customer_office_id}, where:{id:{_eq:$id}}){
    returning{
      id
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

  const [getInvoicePDF, { loading: l, data: d, error: err }] = useLazyQuery(
    GET_INVOICE_PDF,
    {
      onError (error) {
        message.error(error)
      },
      onCompleted (data) {
        const invoice = get(data, 'invoice_report', null)
        if (invoice) {
          window.open(invoice, '_blank')
        }
      }
    }
  )

  const [update_trip_customer_branch] = useMutation(
    UPDATE_TRIP_CUSTOMER_BRANCH,
    {
      onError (error) { message.error(error.toString()) }
    }
  )

  const [update_trip_gst_hsn] = useMutation(
    UPDATE_TRIP_GST_HSN,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        const id = get(data, 'update_trip.returning[0].id', null)
        message.success('Updated!!')
        onBillingComplete(id)
      }
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
  const headoffice = !isEmpty(customer_branches) ? customer_branches.filter(branch => branch.branch_name === 'Head Office') : null
  const trip_contact = customer_branch || (!isEmpty(headoffice) ? headoffice[0] : null)

  const onBillingComplete = (id) => {
    getInvoicePDF({ variables: { trip_id: id } })
  }

  const onBranchChange = (value, branch) => {
    const description = `${!isEmpty(customer_branch) ? customer_branch.branch_name : 'Nill'} to ${branch.children} changed`
    if ((!isEmpty(customer_branch) && customer_branch.id) !== value) {
      update_trip_customer_branch({
        variables: {
          id: trip_id,
          branch_id: value,
          description: description,
          updated_by: context.email
        }
      })
    } else return null
  }

  const onGstHsnChange = (form) => {
    setDisableButton(true)
    update_trip_gst_hsn({
      variables: {
        id: trip_id,
        gst: form.gst,
        hsn: form.hsn,
        customer_office_id: trip_contact.id,
        updated_by: context.email
      }
    })
  }

  const email = (
    <Row justify='start' key='footer' gutter={10}>
      <Col flex='auto'>
        <Input placeholder='Email Address' />
      </Col>
      <Col flex='120px'>
        <Button type='primary'>Send Email</Button>
      </Col>
    </Row>
  )

  const title = (
    <div>
      Billing & Invoice - <Link href='/customers/[1d]' as={`/customers/${cardcode}`}><a>{get(customer, 'name', null)}</a></Link>
    </div>)
  return (
    <div>
      <Modal
        title={title}
        visible={visible}
        onCancel={onHide}
        footer={[]}
      >
        {loading ? <Loading /> : (
          <Form layout='vertical' onFinish={onGstHsnChange}>
            <Row gutter={20}>
              <Col xs={24} sm={12}>
                <Row>
                  <Col sm={24}>
                    <Form.Item label='Branch Detail' name='branch_name' initialValue={get(trip_contact, 'branch_name', null)}>
                      <Select
                        placeholder='Select Branch'
                        onChange={onBranchChange}
                      >
                        {customer_branches && customer_branches.map(_branch => (
                          <Select.Option key={_branch.id} value={_branch.id}>{_branch.branch_name}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24}>
                    <div className='userBranchList'>
                      {trip_contact ? (
                        <div className='loadDetailsRowz'>
                          <div className='text-primary'><b>{trip_contact.branch_name}</b></div>
                          <div>{trip_contact.name},</div>
                          <div>{trip_contact.address},</div>
                          <div> <span>{trip_contact.city} - {trip_contact.pincode}, {trip_contact.state}</span></div>
                          <div>Contact: <b>{trip_contact.mobile}</b></div>
                        </div>) : null}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col sm={12}>
                <Form.Item
                  label='GST Number'
                  name='gst'
                  initialValue={trip.gst}
                >
                  <Input value={trip.gst} placeholder='GST number' />
                </Form.Item>
                <Form.Item
                  label='HSN Number'
                  name='hsn'
                  initialValue={trip.hsn}
                >
                  <Input value={trip.hsn} placeholder='HSN number' />
                </Form.Item>
                <Row justify='end'>
                  <Button type='primary' block icon={<PrinterOutlined />} loading={disableButton} htmlType='submit'> Save & Print Invoice</Button>
                </Row>
              </Col>
            </Row>
          </Form>)}
      </Modal>
    </div>
  )
}

export default BillingAndInvoiced
