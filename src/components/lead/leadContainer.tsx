import {  Input, Button, Form,message,Card,Select } from 'antd'
import CitySelect from '../common/citySelect'
import { useState } from 'react'
import get from 'lodash/get'
import { gql, useMutation, useQuery ,useLazyQuery} from '@apollo/client'
import u from '../../lib/util'

const PARTNER_LEAD_QUERY = gql`
query partner_lead{
  truck_type(where:{active:{_eq:true}}){
    id
    name
  }
  config(where: {key: {_eq: "LEAD_OWNER"}}){
    value
  }
}`

const PARTNER_AGGREGATE_QUERY = gql`
query partner_aggregate($mobile:String!){
  partner_user_aggregate(where:{mobile:{_eq:$mobile}}){
  aggregate{
     count
    }
  }
}`

const INSERT_PARTNER_LEAD_MUTATION = gql`
mutation create_partner_lead($description: String, $topic: String, $created_by: String, $name: String, $mobile: String, $city_id: Int, $onboarded_by_id: Int, $partner_status_id: Int, $channel_id: Int) {
  insert_partner(objects: {name: $name, city_id: $city_id, partner_status_id: $partner_status_id, channel_id: $channel_id, onboarded_by_id: $onboarded_by_id, partner_users: {data: {mobile: $mobile}}, partner_comments: {data: {description: $description, created_by: $created_by, topic: $topic}}}) {
    affected_rows
  }
}

`
const REGISTRATION_ERROR_EMAIL = gql`
mutation registration_error_email($name:String!,$truck_type:String!,$mobile:String!,$city:String!){
  registration_error_email(truck_registration_input: {name: $name, mobile: $mobile, truck_type: $truck_type, city: $city}) {
    description
    status
  }
}`


const Lead = () => {

  const [city_id, setCity_id] = useState(null)
  const [disableButton, setDisableButton] = useState(false)
 const [registration_complete,setRegistration_complete] = useState(false)
 const { topic } = u
 const [form] = Form.useForm()

  const { loading, error, data:lead_data } = useQuery(
    PARTNER_LEAD_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )

  let _data = {}

  if (!loading) {
    _data = lead_data
  }

  const truck_type = get(_data, 'truck_type', [])
  const employee_id = get(_data, 'config[0].value.employee_id', null)
 
  const typeList = truck_type.map((data) => {
    return { value: data.name, label: data.name }
  })

  console.log('LeadContainer error',error)

  
  const [getPartnerAggregate,{loading:aggregate_loading,data,error:aggregate_error}] = useLazyQuery(
    PARTNER_AGGREGATE_QUERY,
    {
      onError (error) {
        message.error(error.toString())
      },
      onCompleted (data) {
        if(data.partner_user_aggregate.aggregate.count ===0){
          updatePartnerLead({
            variables: {
              city_id:  parseInt(city_id, 10),
              name:  form.getFieldValue("name"),
              mobile:form.getFieldValue("mobile") ,
              onboarded_by_id:employee_id,
              partner_status_id: 8,
              channel_id: 2,
              created_by:form.getFieldValue("mobile"),
              description:''.concat(form.getFieldValue("truck_type")),
          topic:topic.truck_owner_registration
            }
          }) 
        }
      setDisableButton(true) 
      setRegistration_complete(true)     
      }
    }
  )

  const _get_partner_aggregate_by_mobile = (mobile)=>getPartnerAggregate({ variables: { mobile } })

  const   validate_mobile_no_and_create_lead   = () => 
  _get_partner_aggregate_by_mobile( form.getFieldValue( "mobile")) 
  
  const [updatePartnerLead] = useMutation(
    INSERT_PARTNER_LEAD_MUTATION,
    {
      onError () {
        onRegisterEmail()
        setDisableButton(false)
      },
      onCompleted () { 
        setDisableButton(false)
        setRegistration_complete(true) 
      }
    }
  )

  const [registerErrorEmail] = useMutation(
    REGISTRATION_ERROR_EMAIL,
    {
      onError () {
      },
      onCompleted () { 
      }
    }
  )

  const onRegisterEmail = () => {
    registerErrorEmail({
     variables:{
       name:form.getFieldValue("name"),
       mobile:form.getFieldValue("mobile"),
       truck_type:''.concat(form.getFieldValue("truck_type")),
       city:form.getFieldValue("city")
     }
    })
  }

  const onCityChange = (city_id) => {
    setCity_id(city_id)
  }

  return (
    <>
    {
      registration_complete   ? 
     <div>
      <h2 className='h2color'>Thank you for your interest,We will contact you shortly</h2>
      <h2 className='h2color'>Contact No:9362200200</h2>
      </div>
    :
    <Card size='small' className='mt10' style={{width:320}}> 
    <Form layout='vertical' onFinish={()=>validate_mobile_no_and_create_lead()} form={form} >
      <h3>Truck Owner Registration</h3>
              <Form.Item
                label='Name'
                name='name'
                rules={[{ required: true, message: 'Name is required field!' }]}
              >
                <Input placeholder='Name' maxLength={100} autoComplete='off'/>
              </Form.Item>
              <Form.Item
                label='Phone Number'
                name='mobile'
                rules={[{ required: true, message: 'Phone Number is required field' }]}
              >
               <Input placeholder='Phone Number' maxLength={10}	autoComplete='off'/>
              </Form.Item>
              <Form.Item >
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
         
      </Form>
    </Card> }
      </>
  )
}


export default Lead
