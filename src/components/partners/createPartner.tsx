import React from 'react'
import CitySelect from '../common/citySelect'
import Link from 'next/link'
import { Row, Col, Card, Input, Form, Button, Select, Space, message, Tag } from 'antd'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import Loading from '../common/loading'

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
  const { onSubmit, form, setCity, disableButton, partner_info, data_loading,access,setDisableAddTruck,disableAddTruck } = props

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
  console.log('CreatePartnersContainer error', error)
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

  const onCityChange = (city_id) => {
    setCity(city_id)
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
    data_loading ? <Loading /> : (
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
                label='Contact Person'
                name='contact_name'
                initialValue={get(partner_info, 'partner_users[0].name', null)}
              >
                <Input placeholder='Contact Person' disabled={!!partner_info} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <Form.Item
                label='Phone Number'
                name='mobile'
                rules={[{ required: true, message: 'Mobile is required field' }]}
                initialValue={get(partner_info, 'partner_users[0].mobile', null)}
              >
                <Input placeholder='Phone Number' disabled={!!partner_info} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <Form.Item
                label='Email Address'
                name='email'
                rules={[{ required: true, message: 'Email is required field' }]}
                initialValue={get(partner_info, 'partner_users[0].email', null)}
              >
                <Input placeholder='Email Address' disabled={!!partner_info} />
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
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <Form.Item
                label='Cibil'
                name='cibil'
                rules={[{ required: true, message: 'Cibil Score is required field!' }]}
                initialValue={get(partner_info, 'cibil', null)}
              >
                <Input placeholder='Cibil Score ' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <Form.Item
                label='Building Number'
                name='no'
                rules={[{ required: true, message: 'Building Number is required field!' }]}
                initialValue={get(partner_info, 'address.no', null)}
              >
                <Input placeholder='Building Number' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <Form.Item
                label='Address'
                name='address'
                rules={[{ required: true, message: 'Address is required field!' }]}
                initialValue={get(partner_info, 'address.address', null)}
              >
                <Input placeholder='Address' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <CitySelect onChange={onCityChange} label='City' name='city' required city={get(partner_info, 'city.name', null)} />
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <Form.Item
                label='State'
                name='state'
                rules={[{ required: true, message: 'State is required field!' }]}
                initialValue={get(partner_info, 'address.state', null)}
              >
                <Select
                  placeholder='Select State'
                  options={state_list}
                  optionFilterProp='label'
                  showSearch
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={4}>
              <Form.Item
                label='Pin Code'
                name='pin_code'
                rules={[{ required: true, message: 'Zip Code is required field' }]}
                initialValue={get(partner_info, 'address.pin_code', null)}
              >
                <Input placeholder='Pin Code' />
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
                <Input placeholder='Account Number' />
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
                <Input.Password placeholder='Confirm Account No' />
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
          </Row>
        </Card>
        <Row justify='end'>
          <Col xs={24} className='text-right mb10'>
            
              {partner_info ? 
              <Space>
              <Button onClick={() => setDisableAddTruck(!disableAddTruck)} >Skip</Button>
              <Button type='primary' loading={disableButton} disabled={!access || !disableAddTruck} htmlType='submit'>Submit</Button>
              </Space> : (
                <Space>
                <Link href='/partners'>
                  <Button>Back</Button>
                </Link>
                <Button type='primary' loading={disableButton} disabled={!access} htmlType='submit'>Submit</Button>
                </Space>)}
              
          </Col>
        </Row>
      </Form>)
  )
}

export default CreatePartner
