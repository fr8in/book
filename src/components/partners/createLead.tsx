
import { Modal, Button, Input, Row, Col, Form, Select,message } from 'antd'
import { gql, useMutation,useQuery } from '@apollo/client'
const { TextArea } = Input
const { Option } = Select

const INSERT_PARTNER_LEAD_MUTATION = gql`
mutation partner_lead_create(
  $name: String,
  $mobile: String,
  $contact_name: String,
  $partner_status_id: Int,
  $channel_id:Int) 
  {
  insert_partner(
    objects: {
      name: $name,
      partner_users:
       {data: { 
         mobile: $mobile,
         name: $contact_name}
        },
      partner_status_id: $partner_status_id,
      channel_id:$channel_id}
    ) {
    returning {
      id
    }
  }
}
`
const PARTNERS_LEAD_QUERY = gql`
query create_partner_lead{
  channel{
    id
    name
  }
  employee{
    id
    name
  }
}
`

const CreateLead = (props) => {
  function handleChange (value) {
    console.log(`selected ${value}`)
  }
  const onChange = e => {
    console.log(e)
  }
  const { visible, onHide } = props

  const [updatePartnerLeadAddress] = useMutation(
    INSERT_PARTNER_LEAD_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Updated!!') }
    }
  )
 
  
  const { loading, error, data } = useQuery(
    PARTNERS_LEAD_QUERY,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersLeadContainer error', error)

  
  var channel = [];
  var employee = [];
  if (!loading) {
    
     channel = data.channel
     employee = data.employee
  }
 
  const channelList = channel.map((data) => {
    return { value: data.id, label: data.name }
  })
  const employeeList = employee.map((data) => {
    return { value: data.id, label: data.email }
  })

  const onPartnerLeadChange =(form) =>{
    console.log('inside form submit', form)
    updatePartnerLeadAddress({
      variables: {
        name: form.name,
        contact_name: form.contact_name,
        mobile: form.mobile,
        partner_status_id: 8,
        channel_id: form.channel,
      }
    })   
   }
  
  return (
    <Modal
      title='Create Lead'
      visible={visible}
      onCancel={onHide}
      footer={null}
    >
      <Form layout='vertical' onFinish={onPartnerLeadChange}>
        <Form.Item
           name='name'
        >  
          <Input placeholder='Company Name'  />
        </Form.Item>
        <Form.Item
        name='contact_name'
        >
          <Input placeholder=' Name' />
        </Form.Item>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item
            name='mobile'
            >
              <Input placeholder='Phone' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item>
              <Select defaultValue='' allowClear>
                <Option value=' '> </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item
             name='channel'
            >
              <Select defaultValue='Select Channel' onChange={handleChange} options={channelList} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item>
              <Select defaultValue='Select Owner' onChange={handleChange} options={employeeList} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <TextArea placeholder='Comment' allowClear onChange={onChange} />        
        </Form.Item>
        <Row justify='end'>
        <Button type='primary' key='back' htmlType='submit'> Submit </Button>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateLead
