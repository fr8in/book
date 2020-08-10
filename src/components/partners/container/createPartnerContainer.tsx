import { Row, Col, Card, Input, Form, Button, Select,Space,message } from 'antd'
import { gql, useMutation,useQuery } from '@apollo/client'
import { useState } from 'react'
import employeeList from '../../../../mock/sourcing/employeeList'

const PARTNERS_QUERY = gql`
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
mutation partner_create($name: String, $email: String, $cibil: Int, $address: jsonb, $pinCode: Int, $accountNumber: String, $ifscCode: String, $mobileNo: String, $panNo: String, $contactPersonName: String, $acconnt_holder: String, $partner_status_id:Int) {
  insert_partner(objects: {name: $name, pan: $panNo, cibil: $cibil, address: $address, pin_code: $pinCode, account_number: $accountNumber, ifsc_code: $ifscCode, partner_users: {data: {mobile: $mobileNo, name: $contactPersonName, email: $email}}, acconnt_holder: $acconnt_holder,partner_status_id:$partner_status_id}) {
    returning {
      id
    }
  }
}
`
const PartnerProfile = () => {
  const initialAddress ={ 
    no:null,
    address:null,
    city:null,
    state:null,
    pinCode:null
  }
  const [address,setAddress] =useState(initialAddress)
  const [name,setName] =useState('')
  const [contactName,setContactName] =useState('')
  const [mobileNo,setMobileNo] =useState('')
  const [email,setEmail] =useState('')
  const [panNo,setPanNo] =useState('')
  const [cibil,setCibil] = useState('')
  const [accountHolder,setAccountHolder] = useState('')
  const [accountNo,setAccountNo] = useState('')
  const [ifscCode,setIfscCode] = useState('')

  const [updatePartnerAddress] = useMutation(
    INSERT_PARTNER_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
 
  
  const { loading, error, data } = useQuery(
    PARTNERS_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersContainer error', error)
  var employee = [];
  var city = [];
  var partner_advance_percentage = [];
  if (!loading) {
    partner_advance_percentage = data.partner_advance_percentage
     city = data.city
     employee = data.employee
  }
 
  const advancePercentageList = partner_advance_percentage.map((data) => {
    return { value: data.name, label: data.id }
  })
  const cityList = city.map((data) => {
    return { value: data.name, label: data.id }
  })
  const employeeList = employee.map((data) => {
    return { value: data.email, label: data.id }
  })

  const onNameChange = (e) => {
    setName( e.target.value );
  };
  const onContactPersonChange = (e) => {
    setContactName(e.target.value );
  };
  const onMobileNoChange = (e) => {
    setMobileNo(e.target.value );
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value );
  };
  const onPanChange = (e) => {
    setPanNo(e.target.value );
  };
  const onCibilChange = (e) => {
    setCibil(e.target.value );
  };
  const onAccountHolderChange = (e) => {
    setAccountHolder(e.target.value );
  };
  const onAccountNoChange = (e) => {
    setAccountNo(e.target.value );
  };
  const onIfscCodeChange = (e) => {
    setIfscCode(e.target.value );
  };
  const onBuildingNoChange = (e) => {
    setAddress({ ...address, no: e.target.value });
  };

  const onAddressChange = (e) => {
    setAddress({ ...address, address: e.target.value });
  };
  const onCityChange = (e) => {
    setAddress({ ...address, city: e.target.value });
  };

  const onStateChange = (e) => {
    setAddress({ ...address, state: e.target.value });
  };
  const onPinCodeChange = (e) => {
    setAddress({ ...address, pinCode: e.target.value });
  };

  const onSubmit = () => {
    updatePartnerAddress({
      variables: {
        name: name,
        contactPersonName:contactName,
        mobileNo:mobileNo,
        email:email,
        panNo:panNo,
        cibil:cibil,
        accountNumber:accountNo,
        acconnt_holder:accountHolder,
        ifscCode:ifscCode,
        address:address,
        partner_status_id:6
      }
    })
  }


  return (
    <Form layout='vertical'>
      <Card size='small' title='Personal Details' className='border-top-blue mb10'>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Partner Name (Should be RC name)'
              name='Partner Name (Should be RC name)'
              rules={[{ required: true, message: 'Partner Name(Should be RC name) is required field!' }]}
            >
              <Input onChange={onNameChange} placeholder='PartnerName' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Contact Person'
              name='Contact Person'
              rules={[{ required: true, message: 'Contact Person is required field!' }]}
            >
              <Input onChange={onContactPersonChange} placeholder='Contact Person' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Phone Number'
              name='Phone Number'
              rules={[{ required: true, message: 'Mobile Number is required field' }]}
            >
              <Input onChange={onMobileNoChange} placeholder='Phone Number' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Email Address'
              name='Email Address'
              rules={[{ required: true, message: 'Email is required field' }]}
            >
              <Input onChange={onEmailChange} placeholder='Email Address' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={4}>
            <Form.Item
              label='Pan Number'
              name='Pan Number'
              rules={[{ required: true, message: 'Pan Number is required field' }]}
            >
              <Input onChange={onPanChange} placeholder='Pan Number' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Cibil Score'
              name='Cibil Score'
              rules={[{ required: true, message: 'Cibil Score is required field!' }]}
            >
              <Input onChange={onCibilChange} placeholder='Cibil Score ' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Building Number'
              name='Building Number'
              rules={[{ required: true, message: 'Building Number is required field!' }]}
            >
              <Input onChange={onBuildingNoChange} placeholder='Building Number' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Address'
              name='Address'
              rules={[{ required: true, message: 'Address is required field!' }]}
            >
              <Input onChange={onAddressChange} placeholder='Address' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
          <Form.Item
              label='State'
              name='State'
              rules={[{ required: true, message: 'State is required field!' }]}
            >
              <Input onChange={onStateChange} placeholder='State' />
            </Form.Item>
            </Col>
          <Col xs={24} sm={4}>
            <Form.Item
              label='Zip Code'
              name='Zip Code'
              rules={[{ required: true, message: 'Zip Code is required field' }]}
            >
              <Input onChange={onPinCodeChange} placeholder='Zip Code' />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card title='Bank Details' size='small' className='border-top-blue mb10'>
        <Row gutter={10}>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Account Holder Name'
              name='Account Holder Name'
              rules={[{ required: true, message: 'Account Holder Name is required field!' }]}
            >
              <Input onChange={onAccountHolderChange} placeholder='Address' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Account No'
              name='Account No'
              rules={[{ required: true, message: 'Account No is required field!' }]}
            >
              <Input onChange={onAccountNoChange} placeholder='Account No' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='Re-enter Account No'
              name='Re-enter Account No'
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
              name='IFSC Code'
              rules={[{ required: true, message: 'IFSC Code is required field!' }]}
            >
              <Input onChange={onIfscCodeChange} placeholder='IFSC Code' />
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
              name='Advance Percentage'
              rules={[{ required: true }]}
            >
              <Select>
                <Select options={advancePercentageList}   value='Advance Percentage' disabled> </Select>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='City'
              name='City'
              rules={[{ required: true, message: 'City is required field!' }]}
            >
              <Select>
                <Select options={cityList}  value='City'> </Select>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item
              label='On Boarded By'
              name='On Boarded By'
              rules={[{ required: true, message: 'On-Boarded By is required field!' }]}
            >
              <Select>
                <Select options={employeeList} value='On Boarded By'> </Select>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>
     
      <Row justify='end'>
        <Col xs={24} className='text-right'>
        <Space>
          <Button>Cancel</Button>
          <Button type='primary' onClick={onSubmit} >Submit</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  )
}
export default PartnerProfile
