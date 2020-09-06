import { Row, Col, Card, Input, Form, Button, Select, Space, message } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'

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
    city{
      id
      name    
    }
  }
`

const INSERT_PARTNER_MUTATION = gql`
  mutation partner_create(
    $name: String, $email: String, $cibil: Int, $address: jsonb, 
    $pin_code: Int, $account_number: String, $ifsc_code: String, 
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

const PartnerProfile = () => {
  const { loading, error, data } = useQuery(
    PARTNERS_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)

  const [updatePartner] = useMutation(
    INSERT_PARTNER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )

  var employee = []
  var city = []
  var partner_advance_percentage = []
  if (!loading) {
    partner_advance_percentage = data.partner_advance_percentage
    city = data.city
    employee = data.employee
  }

  const advancePercentageList = partner_advance_percentage.map((data) => {
    return { value: data.id, label: data.name }
  })
  const cityList = city.map((data) => {
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
      city: form.city,
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
        ifsc_code: form.ifsc_code,
        address: address,
        partner_status_id: 6,
        partner_advance_percentage_id: form.advance_percentage,
        city_id: form.city,
        onboarded_by_id: form.on_boarded_by
      }
    })
  }

  return (
    <Form layout='vertical' onFinish={onPartnerChange}>
      <Card size='small' title='Personal Details' className='border-top-blue mb10'>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Partner Name (Should be RC name)'
              name='name'
              rules={[{ required: true, message: 'Partner Name(Should be RC name) is required field!' }]}
            >
              <Input placeholder='PartnerName' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Contact Person'
              name='contact_name'
              rules={[{ required: true, message: 'Contact Person is required field!' }]}
            >
              <Input placeholder='Contact Person' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Phone Number'
              name='mobile'
              rules={[{ required: true, message: 'Mobile Number is required field' }]}
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
              rules={[{ required: true, message: 'Pan Number is required field' }]}
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
            <Input placeholder='State' />
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
              name='re_enter_account_no'
              rules={[{ required: true, message: 'Re-enter Account No is required field!' }]}
            >
              <Input placeholder='Confirm Account No' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='IFSC Code'
              name='ifsc_code'
              rules={[{ required: true, message: 'IFSC Code is required field!' }]}
            >
              <Input placeholder='IFSC Code' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Bank Name'
            >
              <Input placeholder='Bank Name' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Branch Name'
            >
              <Input placeholder='Branch Name' />
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
              <Select>
                <Select.Option options={advancePercentageList} value='Advance Percentage' disabled> </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='City'
              name='city'
              rules={[{ required: true, message: 'City is required field!' }]}
            >
              <Select>
                <Select.Option options={cityList} value='City'> </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='On Boarded By'
              name='on_boarded_by'
              rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
            >
              <Select>
                <Select.Option options={employeeList} value='On Boarded By'> </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Row justify='end'>
        <Col xs={24} className='text-right'>
          <Space>
            <Button>Cancel</Button>
            <Button type='primary' htmlType='submit'>Submit</Button>
        </Space>
        </Col>
      </Row>
    </Form>
  )
}
export default PartnerProfile
