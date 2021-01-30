import React from 'react'
import CitySelect from '../common/citySelect'
import Link from 'next/link'
import { Row, Col, Card, Input, Form, Button, Select, Space, message, Tag } from 'antd'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import Loading from '../common/loading'
import u from '../../lib/util'

const PARTNERS_SUBSCRIPTION = gql`
  query advance_state_emp{
    employee(where:{active: {_eq: 1}}){
      id
      email
    }
    partner_advance_percentage{
      id
      name
    }
    state{
      id
      name
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

const CreatePartner = (props) => {
  const { onSubmit, form, setCity, disableButton, partner_info, data_loading, setDisableAddTruck, disableAddTruck } = props
  const mobile = get(partner_info, 'partner_users[0].mobile', null)
  const { loading, error, data } = useQuery(
    PARTNERS_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [getBankDetail, { data: d, error: err }] = useLazyQuery(
    IFSC_VALIDATION,
    {
      onError (error) {
        message.error(`Invalid IFSC: ${error}`)
        form.resetFields(['ifsc'])
      },
      onCompleted (data) {
        const bank_detail = get(data, 'bank_detail', null)
        form.setFieldsValue({ bank_name: get(bank_detail, 'bank', ''), branch_name: get(bank_detail, 'branch', '') })
        message.success(`Bank name: ${get(bank_detail, 'bank', '')}!!`)
      }
    }
  )

  let _data = {}
  if (!loading) {
    _data = data
  }

  const partner_advance_percentage = get(_data, 'partner_advance_percentage', [])
  const employee = get(_data, 'employee', [])
  const state = get(_data, 'state', [])

  const state_list = state.map((data) => {
    return { value: data.name, label: data.name }
  })

  const advancePercentageList = partner_advance_percentage.map((data) => {
    return { value: data.id, label: data.name }
  })
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })
  const validateIFSC = () => {
    getBankDetail(
      { variables: { ifsc: form.getFieldValue('ifsc') } }
    )
  }

  const rules = [
    {
      required: true,
      message: 'Confirm acccount number required!'
    },
    ({ getFieldValue }) => ({
      validator (rule, value) {
        if (!value || getFieldValue('account_no') === value) {
          return Promise.resolve()
        }
        return Promise.reject('The account number not matched!')
      }
    })
  ]

  return (
    data_loading
      ? <Loading />
      : (
        <Form layout='vertical' onFinish={onSubmit} form={form}>
          <Card
            size='small'
            title='Personal Details'
            className='border-top-blue mb10'
            extra={<Tag className='status'>{get(partner_info, 'partner_status.name', 'New')}</Tag>}
          >
            <Row gutter={10}>
              <Col xs={24} sm={8} md={8} lg={8} xl={4}>
                <Form.Item
                  label='Partner Name (as per RC)'
                  name='name'
                  rules={[{ required: true, message: 'Name is required field!' }]}
                  initialValue={get(partner_info, 'name', null)}
                >
                  <Input placeholder='Partner Name' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8} md={8} lg={8} xl={4}>
                <Form.Item
                  label='Phone Number'
                  name='mobile'
                  rules={[{ required: true, message: 'Mobile is required field' }]}
                  initialValue={mobile}
                >
                  <Input placeholder='Phone Number' disabled={!!mobile} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8} md={8} lg={8} xl={4}>
                <Form.Item
                  label='PAN'
                  name='pan_no'
                  rules={[{ required: true, message: 'Pan is required field' }]}
                  initialValue={get(partner_info, 'pan', null)}
                >
                  <Input placeholder='Pan Number' />
                </Form.Item>
              </Col>

            </Row>

          </Card>
          <Card title='Bank Details' size='small' className='border-top-blue mb10'>
            <Row gutter={10}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label='Account Holder Name'
                  name='account_holder_name'
                  rules={[{ required: true, message: 'Account Holder Name is required field!' }]}
                  initialValue={get(partner_info, 'account_holder', null)}
                >
                  <Input placeholder='A/C Holder Name' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label='Account No'
                  name='account_no'
                  rules={[{ required: true, message: 'Account No is required field!' }]}
                  initialValue={get(partner_info, 'display_account_number', null)}
                >
                  <Input.Password placeholder='Account Number' />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label='Re-enter Account No'
                  name='confirm'
                  dependencies={['account_no']}
                  rules={rules}
                  initialValue={get(partner_info, 'display_account_number', null)}
                >
                  <Input placeholder='Confirm Account No' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label='IFSC Code'
                  name='ifsc'
                  rules={[{ required: true, message: 'IFSC Code is required field!' }]}
                  initialValue={get(partner_info, 'ifsc_code', null)}
                >
                  <Input placeholder='IFSC Code' onBlur={validateIFSC} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label='Bank Name' name='bank_name'>
                  <Input placeholder='Bank Name' disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label='Branch Name' name='branch_name'>
                  <Input placeholder='Branch Name' disabled />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title='FR8 Details' size='small' className='border-top-blue mb10'>
            <Row gutter={10}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label='Advance Percentage'
                  name='advance_percentage'
                  rules={[{ required: true }]}
                  initialValue={get(partner_info, 'partner_advance_percentage.id', null)}
                >
                  <Select
                    placeholder='Advance Percentage'
                    options={advancePercentageList}
                    optionFilterProp='label'
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label='On Boarded By'
                  name='on_boarded_by'
                  rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
                  initialValue={get(partner_info, 'onboarded_by.id', null)}
                >
                  <Select
                    placeholder='On Boarded By'
                    options={employeeList}
                    optionFilterProp='label'
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  label='Final Payment date'
                  name='final_payment_date'
                  rules={[{ required: true, message: 'Final Payment date is required field!' }]}
                  initialValue={get(partner_info, 'final_payment_date', null)}
                >
                  <Input
                    placeholder='Final Payment date'
                    type='number'
                    min={1}
                    maxLength={2}
                    onInput={u.handleLengthCheck}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Row justify='end'>
            <Col xs={24} className='text-right mb10'>

              {partner_info
                ? (
                  <Space>
                    <Button onClick={() => setDisableAddTruck(!disableAddTruck)}>Skip</Button>
                    <Button type='primary' loading={disableButton} disabled={!disableAddTruck} htmlType='submit'>Submit</Button>
                  </Space>)
                : (
                  <Space>
                    <Link href='/partners'>
                      <Button>Back</Button>
                    </Link>
                    <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Submit</Button>
                  </Space>)}

            </Col>
          </Row>
        </Form>)
  )
}

export default CreatePartner
