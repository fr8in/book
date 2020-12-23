import { useState, useContext } from 'react'
import { Row, Col, Radio, Form, Input, Button, message, Popconfirm } from 'antd'
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import sumBy from 'lodash/sumBy'

const GET_TOKEN = gql`query getToken($ref_id: Int!, $process: String!) {
  token(ref_id: $ref_id, process: $process)
}`

const CREATE_ADDITIONAL_ADVANCE_WALLET = gql`
mutation create_additional_advance($input: AdditionalAdvanceWalletInput) {
  additional_advance_wallet(input: $input) {
    status
    description
  }
}`

const CREATE_ADDITIONAL_ADVANCE_BANK = gql`
mutation create_additional_advance($input: AdditionalAdvanceBankInput) {
  additional_advance_bank(input: $input) {
    status
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

const CreateAdditionalAdvance = (props) => {
  const { trip_info, setAdvanceRefetch, lock } = props

  const [radioValue, setRadioValue] = useState('WALLET')
  const [disableBtn, setDisableBtn] = useState(false)
  const [form] = Form.useForm()
  const context = useContext(userContext)
  const { role } = u
  const edit_access = [role.admin, role.rm, role.accounts_manager, role.bm]
  const access = u.is_roles(edit_access, context)
  const partner_advance_percentage = trip_info.partner_price * 90 / 100
  const amount = parseInt(form.getFieldValue('amount'))
  const payments = (sumBy(trip_info.trip_payments, 'amount') + (amount ? amount : 0))

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

  const { data: tokenData, loading: tokenLoading, refetch } = useQuery(GET_TOKEN, {
    fetchPolicy: "network-only",
    variables: {
      ref_id: trip_info.id,
      process: "ADDITIONAL_ADVANCE"
    }
  })

  const onRadioChange = (e) => {
    setRadioValue(e.target.value)
    form.resetFields()
  }

  const validateIFSC = () => {
    if (form.getFieldValue('ifsc')) {
      getBankDetail({ variables: { ifsc: form.getFieldValue('ifsc') } })
    } else return null
  }

  console.log('IFSC validation Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  let token = {}
  if (!tokenLoading) {
    token = tokenData ? tokenData.token : null
  }

  const bank_detail = get(_data, 'bank_detail', null)

  const [createAdditionalAdvanceWallet] = useMutation(
    CREATE_ADDITIONAL_ADVANCE_WALLET,
    {
      onError(error) { message.error(error.toString()); setDisableBtn(false) },
      onCompleted(data) {
        const status = get(data, 'additional_advance_wallet.status', null)
        const description = get(data, 'additional_advance_wallet.description', null)
        if (status === 'OK') {
          setDisableBtn(false)
          setAdvanceRefetch(true)
          form.resetFields()
          message.success(description || 'Processed!')
        } else { (message.error(description)); setDisableBtn(false) }
        setTimeout(() => {
          refetch()
        }, 5000)
      }
    }
  )

  const [createAdditionalAdvanceBank] = useMutation(
    CREATE_ADDITIONAL_ADVANCE_BANK,
    {
      onError(error) { message.error(error.toString()); setDisableBtn(false) },
      onCompleted(data) {
        const status = get(data, 'additional_advance_bank.status', null)
        const description = get(data, 'additional_advance_bank.description', null)
        if (status === 'OK') {
          setDisableBtn(false)
          setAdvanceRefetch(true)
          form.resetFields()
          message.success(description || 'Processed!')
        } else { (message.error(description)); setDisableBtn(false) }
        setTimeout(() => {
          refetch()
        }, 5000)
      }
    }
  )

  const onSubmit = (form) => {
    setDisableBtn(true)
    if (lock === true) {
      message.error('previous Transaction Pending')
      setDisableBtn(false)
    } else if (radioValue === 'WALLET') {
      createAdditionalAdvanceWallet({
        variables: {
          input: {
            trip_id: trip_info.id,
            amount: parseFloat(form.amount),
            wallet_code: trip_info && trip_info.partner && trip_info.partner.walletcode,
            payment_mode: radioValue,
            comment: form.comment,
            created_by: context.email,
            token: token
          }
        }
      })
    } else {
      createAdditionalAdvanceBank({
        variables: {
          input: {
            trip_id: trip_info.id,
            amount: parseFloat(form.amount),
            wallet_code: trip_info && trip_info.partner && trip_info.partner.walletcode,
            payment_mode: radioValue,
            comment: form.comment,
            created_by: context.email,
            account_name: form.account_name,
            account_number: form.account_number,
            ifsc_code: form.ifsc,
            token: token
          }
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
  const onConfirm = () => {
    form.submit();
  };
  const trip_status = get(trip_info, 'trip_status.id', null)
  const loadedNo = get(trip_info, 'loaded', 'No')
  const disable_adv_btn = (trip_status >= 12 || loadedNo === 'No' || !access)
  return (
    <div className='p10'>
      <Row className='payableHead' gutter={6}>
        <Col xs={24}><b>Additional Advance</b></Col>
      </Row>
    <Row>
      <Col xs={24}>
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Row className='mb10'>
            <Col xs={24}>
              <Radio.Group
                onChange={onRadioChange}
                value={radioValue}
              >
                <Radio value='WALLET'>Wallet</Radio>
                <Radio value='BANK'>Any Account</Radio>
              </Radio.Group>
            </Col>
          </Row>
          {radioValue === 'BANK'
            ? (
              <div>
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Account Name' name='account_name' rules={[{ required: true }]}>
                      <Input placeholder='Account Name' />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Account No' name='account_number' rules={[{ required: true }]}>
                      <Input placeholder='Account Number' />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Confirm Account No' rules={rules} dependencies={['account_number']} name='confirm'>
                      <Input placeholder='Confirm' type='password' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='IFSC Code' name='ifsc' extra={get(bank_detail, 'bank', null)} rules={[{ required: true, message: 'IFSC required!' }]}>
                      <Input placeholder='IFSC Code' onBlur={validateIFSC} />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8} className='reduceMarginTop1'>
                    <Form.Item label='Amount' name='amount' rules={[{ required: true }]}>
                      <Input placeholder='Amount' />
                    </Form.Item>
                  </Col>
                </Row>
              </div>) : radioValue === 'WALLET'
              ? (
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Amount' name='amount' extra='*Limit PO value' rules={[{ required: true }]}>
                      <Input placeholder='Amount' />
                    </Form.Item>
                  </Col>
                </Row>) : null}
          <Row gutter={10}>
            <Col xs={16}>
              <Form.Item label='Comment' name='comment' rules={[{ required: true }]}>
                <Input placeholder='Comment' />
              </Form.Item>
            </Col>
            <Col xs={8}>
              {
                payments > partner_advance_percentage ?
                  <Popconfirm
                    title='Total advance percentage is more than 90%.
                       Do you want to proceed?'
                    okText='Yes'
                    cancelText='No'
                    onConfirm={onConfirm}
                  >
                    <Form.Item label='save' className='hideLabel'>
                      <Button type='primary' disabled={disable_adv_btn || (radioValue === 'BANK' && !form.getFieldValue('ifsc'))} loading={disableBtn || !token} htmlType='submit'>Pay Now</Button>
                    </Form.Item>
                  </Popconfirm> :
                  <Form.Item label='save' className='hideLabel'>
                    <Button type='primary' disabled={disable_adv_btn || (radioValue === 'BANK' && !form.getFieldValue('ifsc'))} loading={disableBtn || !token} htmlType='submit'>Pay Now</Button>
                  </Form.Item>
              }
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
    </div>
  )
}

export default CreateAdditionalAdvance
