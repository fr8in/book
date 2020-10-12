import { useState, useContext } from 'react'
import { Modal, Row, Button, Form, Col, Input, Radio, message } from 'antd'
import PaymentTraceability from './paymentTraceability'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const CUSTOMER_MAMUL_TRANSFER = gql`
mutation customer_mamul_transfer(
  $customer_id: Int!,
  $amount: Float!,
  $trip_id: Int!,
  $created_by: String!,
  $account_holder_name: String!,
  $bank_acc_no: String!,
  $bank_name: String!,
  $ifsc_code:String!,
  $doc_entry: Int!,
  $is_mamul_charges_included: Boolean!
){
  customer_mamul_transfer(
    customer_id: $customer_id, 
    amount:$amount,
    trip_id: $trip_id,
    created_by: $created_by,
    account_holder_name: $account_holder_name,
    bank_acc_no: $bank_acc_no,
    bank_name: $bank_name,
    ifsc_code: $ifsc_code,
    doc_entry:$doc_entry,
    is_mamul_charges_included: $is_mamul_charges_included
  ){
    description
    status
  }
}`

const IFSC_VALIDATION = gql`
query ifsc_validation($ifsc: String!){
  bank_detail(ifsc: $ifsc) {
    bank
    bankcode
    branch
  }
}`

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

  const [customer_mamul_transfer] = useMutation(
    CUSTOMER_MAMUL_TRANSFER,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted (data) {
        setDisableButton(false)
        const status = get(data, 'customer_mamul_transfer.status', null)
        const description = get(data, 'customer_mamul_transfer.description', null)
        if (status === 'OK') {
          message.success(description || 'Processed!')
          onHide()
        } else (message.error(description))
      }
    }
  )

  const validateIFSC = () => {
    getBankDetail({ variables: { ifsc: form.getFieldValue('ifsc') } })
  }

  console.log('IFSC validation Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const bank_detail = get(_data, 'bank_detail', null)

  const onSubmit = (form) => {
    if (amount) {
      setDisableButton(true)
      customer_mamul_transfer({
        variables: {
          customer_id: customer_id,
          doc_entry: selectedRow[0].docentry,
          amount: parseFloat(amount),
          trip_id: parseInt(form.trip_id),
          created_by: context.email,
          account_holder_name: form.account_name,
          bank_acc_no: form.account_number,
          bank_name: bank_detail.bank,
          ifsc_code: form.ifsc,
          is_mamul_charges_included: (form.mamul_include === 'INCLUDE')
        }
      })
    } else { message.error('Enter Amount') }
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
              <Input
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
              <Input.Password
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
            <Button type='primary' disabled={disableButton} htmlType='submit'>Transfer</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default Transfer
