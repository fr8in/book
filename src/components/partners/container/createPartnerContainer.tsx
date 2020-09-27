import { useState } from 'react'
import { Row, Col, Card, Input, Form, Button, Select, Space, message } from 'antd'
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client'
import get from 'lodash/get'
import CitySelect from '../../common/citySelect'
import Link from 'next/link'

const PARTNERS_SUBSCRIPTION = gql`
  query create_partner{
    employee{
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

const INSERT_PARTNER_MUTATION = gql`
  mutation create_partner(
    $name: String, $email: String, $cibil: String, $address: jsonb, 
    $account_number: String, $ifsc_code: String, 
    $mobile: String, $pan_no: String, $contact_name: String, 
    $acconnt_holder: String, $partner_status_id:Int,$city_id:Int,
    $partner_advance_percentage_id:Int,$onboarded_by_id:Int) 
    {
    insert_partner(
      objects: {
        name: $name,
        pan: $pan_no, 
        cibil: $cibil, 
        address: $address, 
        account_number: $account_number,
        ifsc_code: $ifsc_code,
        partner_users:
        {data: {
          mobile: $mobile,
            name: $contact_name,
            email: $email}
          },
        acconnt_holder: $acconnt_holder,
        partner_status_id:$partner_status_id,
        city_id:$city_id,
        partner_advance_percentage_id:$partner_advance_percentage_id,
        onboarded_by_id:$onboarded_by_id
      }) {
      returning {
        id
      }
    }
  }
`

const CreatePartner = () => {
  const [city, setCity] = useState(null)
  const [form] = Form.useForm()

  const { loading, error, data } = useQuery(
    PARTNERS_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  const [getBankDetail, { data: l_data, error: l_error }] = useLazyQuery(
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

  const [updatePartner] = useMutation(
    INSERT_PARTNER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted (data) { message.success('Created!!') }
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

  const onPartnerChange = (form) => {
    console.log('inside form submit', form)
    const address = {
      no: form.no,
      address: form.address,
      city: form.city.split(',')[0],
      state: form.state,
      pin_code: form.pin_code
    }
    updatePartner({
      variables: {
        name: form.name,
        contact_name: form.contact_name,
        mobile: form.mobile,
        email: form.email,
        pan_no: form.pan_no,
        cibil: form.cibil,
        account_number: form.account_no,
        acconnt_holder: form.account_holder_name,
        ifsc_code: form.ifsc,
        address: address,
        partner_status_id: 6,
        partner_advance_percentage_id: form.advance_percentage,
        city_id: parseInt(city),
        onboarded_by_id: form.on_boarded_by
      }
    })
  }

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
    <Form layout='vertical' onFinish={onPartnerChange} form={form}>
      <Card size='small' title='Personal Details' className='border-top-blue mb10'>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Partner Name (Should be RC name)'
              name='name'
              rules={[{ required: true, message: 'Name is required field!' }]}
            >
              <Input placeholder='PartnerName' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Contact Person'
              name='contact_name'
              rules={[{ required: true, message: 'Contact name is required field!' }]}
            >
              <Input placeholder='Contact Person' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Phone Number'
              name='mobile'
              rules={[{ required: true, message: 'Mobile is required field' }]}
            >
              <Input placeholder='Phone Number' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Email Address'
              name='email'
              rules={[{ required: true, message: 'Email is required field' }]}
            >
              <Input placeholder='Email Address' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4}>
            <Form.Item
              label='Pan Number'
              name='pan_no'
              rules={[{ required: true, message: 'Pan is required field' }]}
            >
              <Input placeholder='Pan Number' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Cibil Score'
              name='cibil'
              rules={[{ required: true, message: 'Cibil Score is required field!' }]}
            >
              <Input placeholder='Cibil Score ' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Building Number'
              name='no'
              rules={[{ required: true, message: 'Building Number is required field!' }]}
            >
              <Input placeholder='Building Number' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Address'
              name='address'
              rules={[{ required: true, message: 'Address is required field!' }]}
            >
              <Input placeholder='Address' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='State'
              name='state'
              rules={[{ required: true, message: 'State is required field!' }]}
            >
              <Select
                placeholder='Select State'
                options={state_list}
                optionFilterProp='label'
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4}>
            <Form.Item
              label='Zip Code'
              name='pin_code'
              rules={[{ required: true, message: 'Zip Code is required field' }]}
            >
              <Input placeholder='Zip Code' />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card title='Bank Details' size='small' className='border-top-blue mb10'>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Account Holder Name'
              name='account_holder_name'
              rules={[{ required: true, message: 'Account Holder Name is required field!' }]}
            >
              <Input placeholder='Address' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Account No'
              name='account_no'
              rules={[{ required: true, message: 'Account No is required field!' }]}
            >
              <Input placeholder='Account Number' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Re-enter Account No'
              name='confirm'
              dependencies={['account_no']}
              rules={rules}
            >
              <Input.Password placeholder='Confirm Account No' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='IFSC Code'
              name='ifsc'
              rules={[{ required: true, message: 'IFSC Code is required field!' }]}
            >
              <Input placeholder='IFSC Code' onBlur={validateIFSC} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item label='Bank Name' name='bank_name'>
              <Input placeholder='Bank Name' disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item label='Branch Name' name='branch_name'>
              <Input placeholder='Branch Name' disabled />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card title='FR8 Details' size='small' className='border-top-blue mb10'>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Advance Percentage'
              name='advance_percentage'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='Advance Percentage'
                options={advancePercentageList}
                optionFilterProp='label'
                showSearch
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <CitySelect onChange={onCityChange} label='City' name='city' required />
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='On Boarded By'
              name='on_boarded_by'
              rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
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
        <Col xs={24} className='text-right'>
          <Space>
            <Link href='/partners'>
              <Button>Back</Button>
            </Link>
            <Button type='primary' htmlType='submit'>Submit</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}
export default CreatePartner
