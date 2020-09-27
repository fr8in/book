import { useState, useContext } from 'react'
import { Row, Col, Radio, Form, Input, Button, message } from 'antd'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import userContext from '../../lib/userContaxt'

const CREATE_ADDITIONAL_ADVANCE = gql`
mutation additional_advance($input: AdditionalAdvanceInput) {
  additional_advance(input: $input) {
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
  const { trip_info } = props

  const [radioValue, setRadioValue] = useState('WALLET')
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

  const onRadioChange = (e) => {
    setRadioValue(e.target.value)
  }

  const validateIFSC = () => {
    getBankDetail({ variables: { ifsc: form.getFieldValue('ifsc') } })
  }

  console.log('IFSC validation Error', error)
  let _data = {}
  if (!loading) {
    _data = data
  }

  const bank_detail = get(_data, 'bank_detail', null)

  const [createAdditionalAdvance] = useMutation(
    CREATE_ADDITIONAL_ADVANCE,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) {
        const status = get(data, 'additional_advance.status', null)
        const description = get(data, 'additional_advance.description', null)
        if (status === 'OK') {
          message.success(description || 'Processed!')
        } else (message.error(description))
      }
    }
  )

  const onSubmit = (form) => {
    (radioValue === 'WALLET') ? (
      createAdditionalAdvance({
        variables: {
          input: {
            trip_id: trip_info.id,
            truck_id: trip_info && trip_info.truck && trip_info.truck.id,
            amount: parseFloat(form.amount),
            wallet_code: trip_info && trip_info.partner && trip_info.partner.walletcode,
            payment_mode: radioValue,
            comment: form.comment,
            created_by: context.email
          }
        }
      })
    )
      : (
        createAdditionalAdvance({
          variables: {
            input: {
              trip_id: trip_info.id,
              truck_id: trip_info && trip_info.truck && trip_info.truck.id,
              amount: parseFloat(form.amount),
              wallet_code: trip_info && trip_info.partner && trip_info.partner.walletcode,
              payment_mode: radioValue,
              comment: form.comment,
              created_by: context.email,
              bank_detail: {
                account_name: form.account_name,
                account_number: form.account_number,
                ifsc_code: form.ifsc
              }
            }
          }
        })
      )
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
        return Promise.reject('The account number that you entered do not match!')
      }
    })
  ]

  return (
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
                    <Form.Item label='Account Name' name='account_name'>
                      <Input required placeholder='Account Name' />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Account Number' name='account_number'>
                      <Input required placeholder='Account Number' />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Confirm Account Number' rules={rules} dependencies={['account_number']} name='confirm'>
                      <Input required placeholder='Confirm' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='IFSC Code' name='ifsc' extra={get(bank_detail, 'bank', null)} rules={[{ required: true, message: 'IFSC required!' }]}>
                      <Input required onBlur={validateIFSC} />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={8} className='reduceMarginTop1'>
                    <Form.Item label='Amount' name='amount'>
                      <Input placeholder='Amount' required />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={16}>
                    <Form.Item label='Bank Comment' name='comment'>
                      <Input placeholder='Comment' required />
                    </Form.Item>
                  </Col>
                  <Col xs={8}>
                    <Form.Item label='save' className='hideLabel'>
                      <Button type='primary' disabled={false} htmlType='submit'>Pay to Bank </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </div>) : radioValue === 'WALLET'
              ? (
                <Row gutter={10}>
                  <Col xs={12} sm={8}>
                    <Form.Item label='Amount' name='amount' extra='*Limit PO value'>
                      <Input required placeholder='Amount' />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Row gutter={10}>
                      <Col xs={16}>
                        <Form.Item label='Comment' name='comment'>
                          <Input required placeholder='Comment' />
                        </Form.Item>
                      </Col>
                      <Col xs={8}>
                        <Form.Item label='save' className='hideLabel'>
                          <Button type='primary' className='labelFix' htmlType='submit'>Pay Wallet</Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>) : null}
        </Form>
      </Col>
    </Row>
  )
}

export default CreateAdditionalAdvance
