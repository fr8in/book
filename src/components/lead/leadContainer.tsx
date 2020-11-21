import { Row, Col, Input, Button, Form,message,Card,Select } from 'antd'
import CitySelect from '../common/citySelect'
import { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'


const INSERT_PARTNER_LEAD_MUTATION = gql`
mutation create_partner_lead($name: String, $mobile: String, $city_id: Int) {
  insert_partner(objects: {name: $name, city_id: $city_id, partner_users: {data: {mobile: $mobile}}}) {
    returning {
      id
    }
  }
}
`

const Lead = () => {

  const Trucktype=[
    {
        value:'1',
        label:'32 Feet Multi Axle '
     },
     {
        value:'2',
        label:'23 Feet Single Axle'
     },
     {
        value:'3',
        label:'10 Whl '
     },
     {
        value:'4',
        label:'12 Whl '
     },
]

  const [city_id, setCity_id] = useState(null)
  const [disableButton, setDisableButton] = useState(false)

  
  const typeList = Trucktype.map((data) => {
    return { value: data.value, label: data.label }
  })

  

  const [updatePartnerLeadAddress] = useMutation(
    INSERT_PARTNER_LEAD_MUTATION,
    {
      // onError (error) {
      //   message.error(error.toString())
      //   setDisableButton(false)
      // },
      onCompleted () {
        message.success('Thank you for your interest ,FR8 team will contact you shortly')
        setDisableButton(false)
      }
    }
  )

  const onCityChange = (city_id) => {
    setCity_id(city_id)
  }

  const onPartnerLeadChange = (form) => {
    setDisableButton(true)
    updatePartnerLeadAddress({
      variables: {
        city_id:  parseInt(city_id, 10),
        name: form.name,
        mobile: form.mobile
      }
    })
  }

  return (
    <Form layout='vertical' onFinish={()=>message.success('Thank you for your interest ,FR8 team will contact you shortly')}>
      <Card title={'Truck Owner Registration'}>
      <Row >
        <Col>
          <Row gutter={10}>
            <Col xs={24} sm={24}>
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: 'Name is required field!' }]}
              >
                <Input placeholder='Name' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={24}>
              <Form.Item
                label='Phone Number'
                name='mobile'
                rules={[{ required: true, message: 'Phone Number is required field' }]}
              >
               <Input placeholder='Phone Number' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={24}>
              <Form.Item
                label='Truck Type'
                name='truck_type'
                rules={[{ required: true, message: 'Truck Type is required field' }]}
              >
                <Select placeholder='Select truck type'  options={typeList}/>
              </Form.Item>
            </Col>
            </Row>
          <Row gutter={10} >
          <Col xs={24} sm={24}>
          <Form.Item
                label='Current City'
                name='city'
                rules={[{ required: true, message: 'city is required field' }]}
              >
               <Input placeholder='Phone Number' />
              </Form.Item>
              {/* <Form.Item>
                <CitySelect
                  label='Current City'
                  onChange={onCityChange}
                  required
                  name='city'
                />
              </Form.Item> */}
            </Col>
          </Row>
          <Form.Item className='text-right mb0'>
              <Button type='primary'  key='back' loading={disableButton} htmlType='submit'>Submit</Button>
          </Form.Item>
        </Col>
      </Row>
      </Card>
    </Form>
  )
}

export default Lead
