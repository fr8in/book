import { Row, Col, Input, Button, Form,message,Card,Select } from 'antd'
import CitySelect from '../common/citySelect'
import { useState } from 'react'
import get from 'lodash/get'
import { gql, useMutation, useQuery } from '@apollo/client'
import u from '../../lib/util'
import {now} from 'lodash'

const PARTNER_LEAD_QUERY = gql`
query partner_lead${now()}($mobile:String){
  truck_type {
    id
    name
  }
  config(where: {key: {_eq: "LEAD_OWNER"}}){
    value
  }
  partner_user_aggregate(where:{mobile:{_eq:$mobile}}){
   aggregate{
      count
    }
  }
}`

const INSERT_PARTNER_LEAD_MUTATION = gql`
mutation create_partner_lead($description: String, $topic: String, $created_by: String, $name: String, $mobile: String, $city_id: Int, $onboarded_by_id: Int, $partner_status_id: Int, $channel_id: Int) {
  insert_partner(objects: {name: $name, city_id: $city_id, partner_status_id: $partner_status_id, channel_id: $channel_id, onboarded_by_id: $onboarded_by_id, partner_users: {data: {mobile: $mobile}}, partner_comments: {data: {description:$description, created_by: $created_by,topic:$topic}}}) {
    returning {
      id
    }
  }
}
`

const Lead = () => {

  const [city_id, setCity_id] = useState(null)
  const [disableButton, setDisableButton] = useState(false)
 const [registration_complete,setRegistration_complete] = useState(false)
 const { topic } = u

  const { loading, error, data } = useQuery(
    PARTNER_LEAD_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}

  if (!loading) {
    _data = data
  }

  const truck_type = get(_data, 'truck_type', [])
  const employee_id = get(_data, 'config[0].value.employee_id', null)
  const partner_count = get(_data,'partner_user_aggregate.aggregate.count',{})
 
  const typeList = truck_type.map((data) => {
    return { value: data.name, label: data.name }
  })
  console.log('typeList',typeList)

  console.log('LeadContainer error',error)

  

  const [updatePartnerLeadAddress] = useMutation(
    INSERT_PARTNER_LEAD_MUTATION,
    {
      onError (error) {
        message.error(error.toString())
        setDisableButton(false)
      },
      onCompleted () { 
        setDisableButton(false)
        setRegistration_complete(true) 
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
        mobile: form.mobile,
        onboarded_by_id:employee_id,
        partner_status_id: 8,
        channel_id: 2,
        created_by:form.mobile,
        description:''.concat(form.truck_type),
    topic:topic.truck_owner_registration
      }
    })
  }

  return (
    <Card size='small' className='mt10' style={{width:320}}> 
    {
      registration_complete || partner_count > 0 ?

      <h2>Thank you for your interest ,FR8 team will contact you shortly</h2>
    :
    <Form layout='vertical' onFinish={onPartnerLeadChange} >
      <h3>Truck Owner Registration</h3>
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: 'Name is required field!' }]}
              >
                <Input placeholder='Name' />
              </Form.Item>
              <Form.Item
                label='Phone Number'
                name='mobile'
                rules={[{ required: true, message: 'Phone Number is required field' }]}
              >
               <Input placeholder='Phone Number' />
              </Form.Item>
              <Form.Item>
                <CitySelect
                  label='City'
                  onChange={onCityChange}
                  required
                  name='city'
                />
              </Form.Item>
              <Form.Item
                label='Truck Type'
                name='truck_type'
                rules={[{ required: true, message: 'Truck Type is required field' }]}
              >
                <Select placeholder='Select truck type'  options={typeList}
                mode="multiple"
                showArrow
                style={{ width: '100%'}}/>
              </Form.Item>
          <Form.Item className='text-right mb0'>
              <Button type='primary'  key='back' loading={disableButton} htmlType='submit'>Submit</Button>
          </Form.Item>
         
      </Form>}
      </Card> 
       
  )
}

export default Lead
