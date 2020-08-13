import {
  Modal,
  Button,
  Row,
  Form,
  Select,
  Col,
  Input,
  Divider,
  message,
  DatePicker
} from 'antd'
import { EyeTwoTone } from '@ant-design/icons'
import moment from 'moment'
import { gql, useQuery, useMutation } from '@apollo/client'
import CitySelect from '../common/citySelect'
import Loading from '../common/loading'

const TRUCKS_QUERY = gql`
query trucks($truck_id : Int){
  truck_type {
    id
    name
  }
  truck(where: {id: {_eq: $truck_id}}) {
    height
    truck_no
    truck_type{
      id
      name
    }
    available_at
    partner {
      cardcode
      name
      partner_users(limit:1 , where:{is_admin:{_eq:true}}){
        mobile
      }
      onboarded_by {
        id
        name
        email
      }
    }
  }
}
`

const UPDATE_TRUCK_ACTIVATION_MUTATION = gql`
mutation TruckActivation($available_at:timestamptz,$id:Int,$city_id:Int,$truck_type_id:Int,$truck_status_id:Int) {
  update_truck(_set: {available_at: $available_at, city_id:$city_id, truck_type_id:$truck_type_id,truck_status_id:$truck_status_id}, where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}
`

const onChange = (date, dateString) => {
  console.log(date, dateString)
}

const TruckActivation = (props) => {
  const { visible, onHide, truck_id, title } = props

  const { loading, error, data } = useQuery(
    TRUCKS_QUERY,
    {
      variables: { truck_id: truck_id },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  )
  console.log('TrucksActivation error', error)

  const [updateTruckActivation] = useMutation(
    UPDATE_TRUCK_ACTIVATION_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  var truck_type = []
  var truck_info = {}

  if (!loading) {
    truck_type = data && data.truck_type
    const { truck } = data
    truck_info = truck[0] ? truck[0] : { name: 'ID does not exist' }
  }
  const onboarded_by = truck_info && truck_info.partner && truck_info.partner.onboarded_by && truck_info.partner.onboarded_by.email
  console.log('onboarded_by', onboarded_by)
  const partner_mobile = truck_info && truck_info.partner && truck_info.partner.partner_users && truck_info.partner.partner_users.mobile

  const typeList = truck_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const onTruckActivationSubmit = (form) => {
    console.log('Traffic Added', truck_id)
    updateTruckActivation({
      variables: {
        id: truck_id,
        truck_status_id: 1,
        available_at: form.available_at,
        city_id: parseInt(form.city_id, 10),
        truck_type_id: parseInt(form.truck_type_id, 10)
      }
    })
  }

  return (
    <>
      <Modal
        visible={visible}
        title='Truck Activation'
        onCancel={onHide}
        width='550px'
        footer={[]}
      >
        {loading ? <Loading /> : (
          <Form layout='vertical' onFinish={onTruckActivationSubmit}>
            <Form.Item>
              <Row>
                <Col xs={24} sm={12}>
                  <h4>{truck_info.truck_no}</h4>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                  <h4>Height:{truck_info.height}-ft</h4>
                </Col>
              </Row>
              <Divider />
              <Row gutter={20}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label='Truck Type'
                    name='truck_type_id'
                    rules={[{ required: true }]}
                    initialValue={truck_info.truck_type && truck_info.truck_type.name}
                  >
                    <Select options={typeList} placeholder='Select TruckType' allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label='RC'>
                    <Button
                      type='primary'
                      shape='circle'
                      size='middle'
                      icon={<EyeTwoTone />}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col xs={24} sm={12}>
                  <Form.Item label='Available From' name='available_at' initialValue={moment(truck_info.available_at, 'YYYY-MM-DD')}>
                    <DatePicker onChange={onChange} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label='Vaahan Screen'>
                    <Button
                      type='primary'
                      shape='circle'
                      size='middle'
                      icon={<EyeTwoTone />}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col xs={24} sm={12}>
                  <Form.Item label='On-Boarded By' name='onboarded_by' initialValue={onboarded_by}>
                    <Input placeholder='On-Boarded By' disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <CitySelect label='Available City' />
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{ span: 12, offset: 12 }}>
                  <div>New vehicle on-boarded</div>
                  <div>
                    Partner Name:{truck_info && truck_info.partner && truck_info.partner.name} - {partner_mobile}
                    {truck_info.truck_no}-{truck_info && truck_info.truck_type && truck_info.truck_type.name}-ft
                  </div>
                  <div>Available In: {moment(truck_info.available_at).format('DD-MMM-YY')} </div>
                  <div>On-boarded by: {onboarded_by}</div>
                </Col>
              </Row>
            </Form.Item>
            <Row justify='end'>
              <Button type='primary' key='submit' htmlType='submit'>
            Activate Truck
              </Button>
            </Row>
          </Form>)}
      </Modal>
    </>
  )
}

export default TruckActivation
