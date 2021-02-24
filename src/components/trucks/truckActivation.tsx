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
  Space,
  Checkbox
} from 'antd'
import moment from 'moment'
import { gql, useSubscription, useMutation } from '@apollo/client'
import CitySelect from '../common/citySelect'
import Loading from '../common/loading'
import FileUploadOnly from '../common/fileUploadOnly'
import DeleteFile from '../common/deleteFile'
import ViewFile from '../common/viewFile'
import { useState, useContext } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'

const TRUCKS_QUERY = gql`
subscription truck_activation_detail($truck_id : Int){
  truck(where: {id: {_eq: $truck_id}}) {
    height
    insurance_expiry_at
    truck_no
    single_trip
    truck_files {
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
}`

const UPDATE_TRUCK_ACTIVATION_MUTATION = gql`
mutation truck_activation($available_at:timestamp,$id:Int,$city_id:Int,$truck_type_id:Int,$truck_status_id:Int,$updated_by: String!,$insurance_expiry_at:timestamp,$single_trip:Boolean,$description:String, $topic:String) {
  insert_truck_comment(objects:{truck_id:$id,topic:$topic,description:$description,created_by:$updated_by})
     {
       returning
       {
         id
       }
     }
  update_truck(_set: {available_at: $available_at,single_trip:$single_trip, city_id:$city_id, truck_type_id:$truck_type_id,truck_status_id:$truck_status_id,updated_by:$updated_by,insurance_expiry_at:$insurance_expiry_at}, where: {id: {_eq: $id}}) {
    returning {
      id
    }
  }
}`





const TruckActivation = (props) => {
  const { visible, onHide, truck_id, title, truck_type } = props

  const initial = { city_id: null }
  const context = useContext(userContext)
  const [city, setCity] = useState(initial)
  const [disableButton, setDisableButton] = useState(false)
  const [checked, setChecked] = useState(false)
  const { topic } = u

  const { loading, error, data } = useSubscription(
    TRUCKS_QUERY,
    { variables: { truck_id: truck_id } }
  )


  const [updateTruckActivation] = useMutation(
    UPDATE_TRUCK_ACTIVATION_MUTATION,
    {
      onError (error) {
        setDisableButton(false)
        message.error(error.toString())
      },
      onCompleted () {
        setDisableButton(false)
        message.success('Saved!!')
        onHide()
      }
    }
  )

  

 

  let _data = {}

  if (!loading) {
    _data = data
  }
  const truck_info = get(_data, 'truck[0]', { name: 'ID does not exist' })
  const onboarded_by = truck_info && truck_info.partner && truck_info.partner.onboarded_by && truck_info.partner.onboarded_by.email
  const partner_mobile = truck_info && truck_info.partner && truck_info.partner.partner_users && truck_info.partner.partner_users.mobile

  const rc_files = truck_info && truck_info.truck_files && truck_info.truck_files.filter(file => file.type === u.fileType.rc)
  const vaahan_files = truck_info && truck_info.truck_files && truck_info.truck_files.filter(file => file.type === u.fileType.vaahan)

  const typeList = truck_type.map((data) => {
    return { value: data.id, label: data.name }
  })

  const onCityChange = (city_id) => {
    setCity({ ...city, city_id: city_id })
  }

  const onTruckActivationSubmit = (form) => {
    if ( isEmpty(rc_files)) {
      message.error('RC documents are mandatory!')
    } 
    else if ( isEmpty(vaahan_files)) {
      message.error('Vaahan documents are mandatory!')
    } 
    else {
      setDisableButton(true)
      updateTruckActivation({
        variables: {
          id: truck_id,
          truck_status_id: 5,
          available_at: form.available_at,
          updated_by: context.email,
          city_id: parseInt(city.city_id, 10),
          truck_type_id: parseInt(form.truck_type_id, 10),
          insurance_expiry_at:form.insurance_expiry_at.format('YYYY-MM-DD'),
          single_trip:checked  ? true : false,
          topic:  checked  ? topic.single_trip_deactivation_enable  :  topic.single_trip_deactivation_disable,
          description:form.comment
        }
      })
    }
  }

  const onChange = (e) => {
    setChecked(e.target.checked)
  }

  const dateFormat = 'YYYY-MM-DD'

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
                    initialValue={truck_info.truck_type && truck_info.truck_type.id}
                  >
                    <Select options={typeList} placeholder='Select TruckType' allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label='RC'  name='RC'>
                    <Space>
                      {!isEmpty(rc_files) ? (
                        <Space>
                          <ViewFile
                            id={truck_id}
                            type='truck'
                            file_type={u.fileType.rc}
                            folder={u.folder.approvals}
                            file_list={rc_files}
                          />
                          <DeleteFile
                            id={truck_id}
                            type='truck'
                            file_type={u.fileType.rc}
                            file_list={rc_files}
                          />
                        </Space>)
                        : (
                          <FileUploadOnly
                            id={truck_id}
                            type='truck'
                            folder={u.folder.approvals}
                            file_type={u.fileType.rc}
                          />)}
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col xs={24} sm={12}>
                  <Form.Item label='Available From' name='available_at' initialValue={moment(truck_info.available_at, 'YYYY-MM-DD')}>
                    <DatePicker  style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label='Vaahan Screen'
                  name='Vaahan Screen'>
                    <Space>
                      {!isEmpty(vaahan_files) ? (
                        <Space>
                          <ViewFile
                            id={truck_id}
                            type='truck'
                            file_type={u.fileType.vaahan}
                            folder={u.folder.approvals}
                            file_list={vaahan_files}
                          />
                          <DeleteFile
                            id={truck_id}
                            type='truck'
                            file_type={u.fileType.vaahan}
                            file_list={vaahan_files}
                          />
                        </Space>)
                        : (
                          <FileUploadOnly
                            id={truck_id}
                            type='truck'
                            folder={u.folder.approvals}
                            file_type={u.fileType.vaahan}
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
                  <CitySelect label='Available City' name='city' onChange={onCityChange} required />
                </Col>
              </Row>
              <Row gutter={20}>
              <Col xs={24} sm={9}>
              <Form.Item 
                label='Insurance Expiry Date'
                name='insurance_expiry_at'
                rules={[{ required: true, message: 'Insurance Expiry Date is required field' }]}
                initialValue={truck_info.insurance_expiry_at ? moment(truck_info.insurance_expiry_at, dateFormat) : null}
                 >
                  <DatePicker
                    showToday={false}
                    placeholder='Insurance Expiry Date'
                    format={dateFormat}
                    size='middle'
                  />
                </Form.Item>
                </Col>
                <Col xs={24} sm={5}>
                <Form.Item name='trip' className='mb0' label='Single Trip'>
          <Checkbox onChange={onChange} checked={checked}  value='value'></Checkbox>
        </Form.Item>
        </Col>
        {checked &&
        <Col flex='auto' xs={24} sm={10}>
              <Form.Item name='comment' label='Comment'>
                <Input
                  placeholder='Please Enter Comments......'
                />
              </Form.Item>
            </Col>}
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
                  <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>
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
