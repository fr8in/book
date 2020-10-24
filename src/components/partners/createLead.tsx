import { useState, useContext } from 'react'
import { Modal, Button, Input, Row, Col, Form, Select, message } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'
import CitySelect from '../common/citySelect'
import userContext from '../../lib/userContaxt'

const PARTNERS_LEAD_SUBSCRIPTION = gql`
  query create_partner_lead_channel{
    channel{
      id
      name
    }
    employee(where:{active: {_eq: 1}}){
      id
      email
    }
  }
`

const INSERT_PARTNER_LEAD_MUTATION = gql`
  mutation create_partner_lead(
    $name: String,
    $mobile: String,
    $contact_name: String,
    $partner_status_id: Int,
    $channel_id:Int,
    $description:String,
    $onboarded_by_id:Int,
    $topic:String,
    $created_by:String,
    $city_id: Int) 
    {
    insert_partner(
      objects: {
        name: $name,
        city_id: $city_id,
        partner_comments: 
        {data: 
          [{description: $description,
          topic: $topic,
          created_by: $created_by}]
        }
        partner_users:
        {data: { 
          mobile: $mobile,
          name: $contact_name}
        },
        partner_status_id: $partner_status_id,
        channel_id:$channel_id,
        onboarded_by_id: $onboarded_by_id}
      ) {
      returning {
        id
        partner_comments{
          topic
        }
      }
    }
  }
`

const CreateLead = (props) => {
  const initial = { city_id: null }
  const { visible, onHide } = props
  const [userComment, setUserComment] = useState('')
  const [obj, setObj] = useState(initial)
  const context = useContext(userContext)
  const [disableButton, setDisableButton] = useState(false)

  const { loading, error, data } = useQuery(
    PARTNERS_LEAD_SUBSCRIPTION,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('CreatePartnersLeadContainer error', error)

  const [updatePartnerLeadAddress] = useMutation(
    INSERT_PARTNER_LEAD_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Updated!!')
        setObj(initial)
        onHide()
      }
    }
  )

  var channel = []
  var employee = []

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
  const handleCommentChange = (e) => {
    setUserComment(e.target.value)
  }
  const onCityChange = (city_id) => {
    setObj({ ...obj, city_id: city_id })
  }

  const onPartnerLeadChange = (form) => {
    setDisableButton(true)
    updatePartnerLeadAddress({
      variables: {
        city_id: obj.city_id,
        name: form.name,
        contact_name: form.contact_name,
        mobile: form.mobile,
        partner_status_id: 8,
        channel_id: form.channel,
        onboarded_by_id: form.employee,
        created_by: context.email,
        description: userComment,
        topic: 'Lead'
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
          <Input placeholder='Company Name' />
        </Form.Item>
        <Form.Item
          name='contact_name'
          rules={[{ required: true }]}
        >
          <Input placeholder=' Name' />
        </Form.Item>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item
              name='mobile'
              rules={[{ required: true }]}
            >
              <Input placeholder='Phone' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <CitySelect
              onChange={onCityChange}
            />
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Item
              name='channel'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='Select Channel'
                options={channelList}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name='employee'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='Select Owner'
                options={employeeList}
                optionFilterProp='label'
                showSearch
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Input.TextArea
            value={userComment}
            onChange={handleCommentChange}
            placeholder='Comment' allowClear
          />
        </Form.Item>
        <Row justify='end'>
          <Button type='primary' key='back' loading={disableButton} htmlType='submit'> Submit </Button>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateLead
