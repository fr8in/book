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
  DatePicker,
  Space
} from 'antd'
import moment from 'moment'
import { gql, useQuery, useMutation } from '@apollo/client'
import CitySelect from '../common/citySelect'
import Loading from '../common/loading'
import FileUploadOnly from '../common/fileUploadOnly'
import DeleteFile from '../common/deleteFile'
import ViewFile from '../common/viewFile'
import { useState } from 'react'
import get from 'lodash/get'

const TRUCKS_QUERY = gql`
query trucks($truck_id : Int){
  truck_type {
    id
    name
  }
  truck(where: {id: {_eq: $truck_id}}) {
    height
    truck_no
    truck_files(where: {deleted_at: {_is_null:true}}){
      id
       type
       file_path
       folder
 }
    truck_type{
      id
      name
    }
    available_at
    partner {
      id
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

  const initial = { city_id: null }

  const [city, setCity] = useState(initial)

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

  let _data = {}

  if (!loading) {
    _data = data
  }
  const truck_info = get(_data, 'truck[0]', { name: 'ID does not exist' })
  const truck_type = get(_data, 'truck_type', [])
  const onboarded_by = truck_info && truck_info.partner && truck_info.partner.onboarded_by && truck_info.partner.onboarded_by.email
  console.log('onboarded_by', onboarded_by)
  const partner_mobile = truck_info && truck_info.partner && truck_info.partner.partner_users && truck_info.partner.partner_users.mobile

  const rc_files = truck_info && truck_info.truck_files && truck_info.truck_files.filter(file => file.type === 'RC')
  const vaahan_files = truck_info && truck_info.truck_files && truck_info.truck_files.filter(file => file.type === 'vaahan')

  console.log('rc_files', rc_files)

  const typeList = truck_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const onCityChange = (city_id) => {
    setCity({ ...city, city_id: city_id })
  }

  const onTruckActivationSubmit = (form) => {
    console.log('Traffic Added', truck_id)
    updateTruckActivation({
      variables: {
        id: truck_id,
        truck_status_id: 5,
        available_at: form.available_at,
        city_id: parseInt(city.city_id, 10),
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
                    <Space>
                      {rc_files && rc_files.length > 0 ? (
                        <Space>
                          <ViewFile
                            id={truck_id}
                            type='truck'
                            file_type='RC'
                            folder='approvals/'
                            file_list={rc_files}
                          />
                          <DeleteFile
                            id={truck_id}
                            type='truck'
                            file_type='RC'
                            file_list={rc_files}
                          />
                        </Space>)
                        : (
                          <FileUploadOnly
                            id={truck_id}
                            type='truck'
                            folder='approvals/'
                            file_type='RC'
                          />)}
                    </Space>
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
                    <Space>
                      {vaahan_files && vaahan_files.length > 0 ? (
                        <Space>
                          <ViewFile
                            id={truck_id}
                            type='truck'
                            file_type='vaahan'
                            folder='approvals/'
                            file_list={vaahan_files}
                          />
                          <DeleteFile
                            id={truck_id}
                            type='truck'
                            file_type='vaahan'
                            file_list={vaahan_files}
                          />
                        </Space>)
                        : (
                          <FileUploadOnly
                            id={truck_id}
                            type='truck'
                            folder='approvals/'
                            file_type='vaahan'
                          />)}
                    </Space>
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
                  <CitySelect label='Available City' onChange={onCityChange} />
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={12}>
                  <div>New vehicle on-boarded</div>
                  <div>
                    Partner Name: {truck_info && truck_info.partner && truck_info.partner.name} - {partner_mobile}
                    {truck_info.truck_no}-{truck_info && truck_info.truck_type && truck_info.truck_type.name}-ft
                  </div>
                  <div>Available In: {moment(truck_info.available_at).format('DD-MMM-YY')} </div>
                  <div>On-boarded by: {onboarded_by}</div>
                </Col>
                <Col xs={24} sm={12} className='text-right'>
                  <Button type='primary' key='submit' htmlType='submit'>
                      Activate Truck
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>)}
      </Modal>
    </>
  )
}

export default TruckActivation
