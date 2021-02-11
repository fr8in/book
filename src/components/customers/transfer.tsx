import { useState, useContext } from 'react'
import { Modal, Row, Button, Form, Col, Input, Radio, message } from 'antd'
import PaymentTraceability from './paymentTraceability'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'


const CUSTOMER_MAMUL_TRANSFER = gql`
mutation customer_mamul_transfer(
  $cardcode: String!,
  $amount: float8!,
  $trip_id: Int!,
  $created_by: String!,
  $account_holder_name: String!,
  $bank_acc_no: String!,
  $bank_name: String!,
  $ifsc_code:String!,
  $doc_entry: Int!,
  $created_on:timestamp,
  $is_mamul_charges_included: Boolean!,
  $status:String
){
  insert_customer_wallet_outgoing(objects:{
    card_code: $cardcode, 
    amount:$amount,
    load_id: $trip_id,
    created_by: $created_by,
    account_holder_name: $account_holder_name,
    account_no: $bank_acc_no,
    bank_name: $bank_name,
    ifsc_code: $ifsc_code,
    doc_entry:$doc_entry,
    created_on:$created_on,
    is_mamul_charges_included: $is_mamul_charges_included,
    status:$status
  }){
    affected_rows
  }
}
`

const IFSC_VALIDATION = gql`
query ifsc_validation($ifsc: String!){
  bank_detail(ifsc: $ifsc) {
    bank
    bankcode
    branch
  }
}`

 const trip_count = gql`query trip_aggregate($trip_id: Int, $customer_id: Int) {
  trip_aggregate(where: {id: {_eq: $trip_id}, destination_in: {_is_null: false}, customer: {id: {_eq: $customer_id}}}) {
    aggregate {
      count
    }
  }
  customer_wallet_outgoing_aggregate(where: {status: {_eq: "APPROVED"}, load_id: {_eq: $trip_id}}) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
`



const Transfer = (props) => {
  const { visible, onHide, cardcode, customer_id, walletcode, wallet_balance } = props

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRow, setSelectedRow] = useState([])
  const [disableButton, setDisableButton] = useState(true)
  const [amount, setAmount] = useState(null)
  const [form] = Form.useForm()
  const context = useContext(userContext)

  const [getBankDetail, { loading, data, error }] = useLazyQuery(
    IFSC_VALIDATION,
    {
      onError (error) {
        message.error(`Invalid IFSC: ${error}`)
        form.resetFields(['ifsc'])
      },
      onCompleted (data) {
        message.success(`Bank name: ${get(bank_detail, 'bank', '')}!!`)
      }
    }
  )

  const [gettripDetail, { loading: trip_loading, data: trip_data, error: trip_error }] = useLazyQuery(trip_count)

  const [customer_mamul_transfer] = useMutation(
    CUSTOMER_MAMUL_TRANSFER,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        message.success('Processed!')
        onHide() 
      }
    }
  )

  const validateIFSC = () => {
    getBankDetail({ variables: { ifsc: form.getFieldValue('ifsc') } })
  }

  const validateTrip = () => {
    gettripDetail ({variables:{trip_id:form.getFieldValue('trip_id'),customer_id:customer_id}})
  }

 
  let _data = {}
  if (!loading) {
    _data = data
  }

  let _trip_data = {}
  if (!trip_loading) {
    _trip_data = trip_data
  }
  const bank_detail = get(_data, 'bank_detail', null)

  const count = get (_trip_data,'trip_aggregate.aggregate.count',null)
  const totalAmountapproved = get(_trip_data,'customer_wallet_outgoing_aggregate.aggregate.sum.amount',null)
 const totalAmount = totalAmountapproved+amount
console.log("totalAmount,",totalAmount)
  const onSubmit = (form) => {
    if( !count ){
      message.error('Trip not releated to customer')
    }
    else if (totalAmount > 5000 || amount < 1 ){ 
      message.error('Transaction Amount Should be Greater than ₹1 Or Lesser Than ₹5000 for this Trip ')
    }
    else {
      setDisableButton(true)
      customer_mamul_transfer({
        variables: {
          cardcode: cardcode,
          doc_entry: selectedRow[0].docentry,
          amount: parseFloat(amount),
          trip_id: parseInt(form.trip_id),
          created_by: context.email,
          account_holder_name: form.account_name,
          bank_acc_no: (form.account_number).trim(),
          bank_name: bank_detail.bank,
          ifsc_code: (form.ifsc).trim(),
          is_mamul_charges_included: (form.mamul_include === 'INCLUDE'),
          created_on:new Date().toISOString(),
          status:"PENDING"
        }
      })
    } 
  }

  const selectOnchange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRows)
    setDisableButton(!!(selectedRows && selectedRows.length === 0))
    setAmount(null)
    form.resetFields(['amount'])
  }

  const rules = [
    {
      required: true,
      message: 'Confirm acccount number required!'
    },
    ({ getFieldValue }) => ({
      validator (rule, value) {
        if (!value || getFieldValue('account_number') === value) {
          return Promise.resolve()
        }
        return Promise.reject('The account number not matched!')
      }
    })
  ]

  return (
    <Modal
      title='Transfer to Bank'
      visible={visible}
      onCancel={onHide}
      width={900}
      bodyStyle={{ padding: 15 }}
      style={{ top: 20 }}
      footer={[]}
    >
      <Row className='mb10'>
        <Col xs={24}>
          <PaymentTraceability
            selectedRowKeys={selectedRowKeys}
            selectOnchange={selectOnchange}
            cardcode={cardcode}
            walletcode={walletcode}
            amount={amount}
            setAmount={setAmount}
            form={form}
            customer_id={customer_id}
            wallet_balance={wallet_balance}
          />
        </Col>
      </Row>
      <Form layout='vertical' form={form} onFinish={onSubmit}>
        <Row gutter={10}>
          <Col xs={8}>
            <Form.Item
              label='Account Name'
              name='account_name'
              rules={[{ required: true, message: 'Account name required!' }]}
            >
              <Input
                placeholder='Account Name'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item
              label='Account Number'
              name='account_number'
              rules={[{ required: true, message: 'Account number required!' }]}
            >
              <Input.Password
                placeholder='Select Account Number'
                disabled={false}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item
              label='Confirm Account Number'
              dependencies={['account_number']}
              rules={rules}
              name='confirm'
            >
              <Input
                placeholder='Confirm Account Number'
                disabled={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={8}>
            <Form.Item
              label='IFSC Code'
              name='ifsc'
              rules={[{ required: true, message: 'IFSC required!' }]}
              extra={get(bank_detail, 'bank', null)}
            >
              <Input
                placeholder='IFSC Code'
                disabled={false}
                onBlur={validateIFSC}
                maxLength={11}
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item
              label='Amount'
              name='amount'
              initialValue={amount}
              rules={[{ required: true, message: 'Amount required!' }]}
            >
              <Input
                placeholder='Amount'
                disabled
                type='number'
              />
            </Form.Item>
          </Col>
          <Col xs={8}>
            <Form.Item
              label='Trip Id'
              name='trip_id'
              rules={[{ required: true, message: 'Trip id required!' }]}
            >
              <Input
                type='number'
                placeholder='Trip id'
                disabled={false}
                onChange={validateTrip}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col flex='auto' className='text-left'>
            <Form.Item name='mamul_include' initialValue='INCLUDE'>
              <Radio.Group>
                <Radio value='INCLUDE'>Include Mamul</Radio>
                <Radio value='NOT_INCLUDE'>Include Special Mamul(System Mamul won't be reduced)</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col flex='90px'>
            <Button type='primary' disabled={disableButton} htmlType='submit'>Create</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default Transfer
