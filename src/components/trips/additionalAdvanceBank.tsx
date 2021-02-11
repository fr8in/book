import { useState, useContext } from 'react'
import { Row, Col, Form, Input, Button, message, Modal } from 'antd'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import Loading from '../common/loading'
import moment from 'moment'

const CREATE_ADDITIONAL_ADVANCE_BANK = gql`
mutation create_additional_advance_bank ($trip_id: Int!, $comment: String!, $ifsc_code: String!,$status:String!, $account_number: String!, $account_name: String!, $created_at: timestamp, $created_by: String!, $amount: float8!, $payment_mode: String!) {
    insert_advance_additional_advance(objects: {trip_id: $trip_id, comment: $comment,status: $status, ifsc_code: $ifsc_code, account_number: $account_number, account_name: $account_name, created_at: $created_at, created_by: $created_by, amount: $amount, payment_mode: $payment_mode}) {
      returning {
        id
        trip_id
      }
    }
  }`

const ADVANCE_EXCEPTION = gql`
mutation advance_exception($trip_id: Int!, $amount: Int!, $is_exception: Boolean!,$mode: String!) {
  advance_exception(trip_id: $trip_id, amount: $amount, is_exception: $is_exception,mode:$mode) {
    status
    result
   description
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

const AdditionalAdvanceBank = (props) => {
  const { trip_info, lock, radioValue } = props

  const [disableBtn, setDisableBtn] = useState(false)
  const [percentageCheck, setPercentageCheck] = useState(false)
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [comment, setComment] = useState('')
  const [form] = Form.useForm()
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.rm, role.accounts_manager]
  const access = u.is_roles(edit_access, context)

  const [getBankDetail, { loading, data, error }] = useLazyQuery(
    IFSC_VALIDATION,
    {
      onError(error) {
        message.error(`Invalid IFSC: ${error}`)
        form.resetFields(['ifsc'])
      },
      onCompleted(data) {
        message.success(`Bank name: ${get(bank_detail, 'bank', '')}!!`)
      }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }
  const bank_detail = get(_data, 'bank_detail', null)

  const [createAdditionalAdvanceBank] = useMutation(
    CREATE_ADDITIONAL_ADVANCE_BANK,
    {
      onError(error) { message.error(error.toString()); setDisableBtn(false) },
      onCompleted(data) {
        const response = get(data, 'insert_advance_additional_advance.returning', null)
        if (response.length > 0) {
          setDisableBtn(false)
          form.resetFields()
          message.success('Request created!')
        } else { (message.error('Error while creating request')); setDisableBtn(false) }
      }
    }
  )

  const [advanceException] = useMutation(
    ADVANCE_EXCEPTION, {
    onError(error) { message.error(error.toString()); setDisableBtn(false) },
    onCompleted(data) {
      if (data.advance_exception.status === "OK") {
        const exception = get(data, 'advance_exception.result', null)
        if (exception === true) { setPercentageCheck(true) }
        else { setPercentageCheck(false); createAdvance() }
      }
      else { message.error(data.advance_exception.description); setDisableBtn(false) }
    }
  }
  )

  const createAdvance = () => {
    setPercentageCheck(false)
    createAdditionalAdvanceBank({
      variables: {
        trip_id: trip_info.id,
        amount: parseFloat(advanceAmount),
        payment_mode: radioValue,
        comment: comment,
        created_by: context.email,
        account_name: accountName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        created_at: moment().format('YYYY-MM-DD'),
        status: 'PENDING'
      }
    })
  }
  const onSubmit = (form) => {
    setAccountName(form.account_name)
    setAccountNumber(form.account_number)
    setIfscCode(form.ifsc)
    setAdvanceAmount(form.amount)
    setComment(form.comment)
    setDisableBtn(true)
    if (lock) {
      message.error('previous Transaction Pending')
      setDisableBtn(false)
    } else {
      advanceException({
        variables: {
          trip_id: trip_info.id,
          amount: parseFloat(form.amount),
          is_exception: false,
          mode: "BANK"
        }
      })
    }
  }
  const rules = [
    {
      required: true,
      message: 'Confirm acccount number required!'
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('account_number') === value) {
          return Promise.resolve()
        }
        return Promise.reject('The account number that you entered do not match!')
      }
    })
  ]

  const validateIFSC = () => {
    if (form.getFieldValue('ifsc')) {
      getBankDetail({ variables: { ifsc: form.getFieldValue('ifsc').trim() } })
    } else return null
  }

  console.log('IFSC validation Error', error)
  const onHandleOk = () => {
    createAdvance()
  }
  const onHandleCancel = () => {
    setPercentageCheck(false)
    setDisableBtn(false)
  }
  const trip_status = get(trip_info, 'trip_status.id', null)
  const loaded = get(trip_info, 'loaded', null)
  const disable_adv_btn = (trip_status >= 12 || loaded === 'No' || !access)
  return (
    <>
      <Modal
        visible={percentageCheck}
        onOk={onHandleOk}
        onCancel={onHandleCancel}
      >
        <p>Total advance percentage is more than 90%.
        Do you want to proceed?
        </p>
      </Modal>
      <div>
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Row gutter={10}>
            <Col xs={12} sm={8}>

              <Form.Item label='Account Name' name='account_name' rules={[{ required: true }]}>
                <Input placeholder='Account Name' />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8}>
              <Form.Item label='Account No' name='account_number' rules={[{ required: true }]}>
                <Input.Password placeholder='Account Number'/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8}>
              <Form.Item label='Confirm Account No' rules={rules} dependencies={['account_number']} name='confirm'>
                <Input placeholder='Confirm' type='number'/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={12} sm={8}>
              <Form.Item label='IFSC Code' name='ifsc' extra={get(bank_detail, 'bank', null)} rules={[{ required: true, message: 'IFSC required!' }]}>
                <Input placeholder='IFSC Code' onBlur={validateIFSC} maxLength={11}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} className='reduceMarginTop1'>
              <Form.Item label='Amount' name='amount' rules={[{ required: true }]}>
                <Input placeholder='Amount' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={16}>
              <Form.Item label='Comment' name='comment' rules={[{ required: true }]}>
                <Input placeholder='Comment' />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label='save' className='hideLabel'>
                <Button type='primary' loading={disableBtn} htmlType='submit'>Create</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {disableBtn &&
          <Loading fixed />}
      </div>
    </>
  )
}

export default AdditionalAdvanceBank
