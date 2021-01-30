
import { Row, Col, Form, Input, Button, message ,DatePicker} from 'antd'
import { gql, useMutation } from '@apollo/client'
import Driver from '../trucks/driver'
import { useState,useContext } from 'react'
import userContext from '../../lib/userContaxt'
import u from '../../lib/util'
import moment from 'moment'

const UPDATE_TRUCK_INFO_MUTATION = gql`
mutation truck_info($description:String, $topic:String, $truck_id: Int,$updated_by: String!,$length:float8,$breadth:float8,$height:float8,$id:Int,$insurance_expiry_at:timestamp){
  insert_truck_comment(objects:{truck_id:$truck_id,topic:$topic,description:$description,created_by:$updated_by})
    {
      returning
      {
        id
      }
    }
  update_truck(_set: {length:$length,breadth:$breadth,height:$height,updated_by:$updated_by,insurance_expiry_at:$insurance_expiry_at}, where: {id: {_eq:$id }}){
    returning{
      id
      length
      breadth
      height
    }
  }
}
`

const TruckInfo = (props) => {
  const { truck_info, id, loading, partner_id } = props
  const [disableButton, setDisableButton] = useState(false)
  const { topic } = u
  const context = useContext(userContext)
  const dateFormat = 'YYYY-MM-DD'
  
  const driver_number = truck_info && truck_info.driver && truck_info.driver.mobile

  const [updateTruckInfo] = useMutation(
    UPDATE_TRUCK_INFO_MUTATION,
    {
      onError (error) { 
        setDisableButton(false)
        message.error(error.toString()) },
      onCompleted () {
        setDisableButton(false)
        message.success('Saved!!') }
    }
  )

  const onDimensionSubmit = (form) => {
    setDisableButton(true)
    updateTruckInfo({
      variables: {
        id: id,
        length: parseFloat(form.length),
        breadth: parseFloat(form.breadth),
        height: parseFloat(form.height),
        updated_by: context.email,
        description:`${topic.truck_dimension} updated by ${context.email}`,
        topic:topic.truck_dimension,
        truck_id: id,
        insurance_expiry_at:form.insurance_expiry_at.format('YYYY-MM-DD')
      }
    })
  }

  return (
    <>
      {loading ? null : (
        <Row>
          <Col sm={20}>
            <Form layout='vertical' onFinish={onDimensionSubmit}>
              <Row gutter={10}>
                <Col xs={24} sm={4}>
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
                  <Form.Item label='save' name='save' className='hideLabel'>
                    <Button type='primary' key='submit' loading={disableButton} htmlType='submit'>Save</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col xs={24} sm={4}>
            <Form layout='vertical'>
              <Driver partner_id={partner_id} truck_id={id} initialValue={driver_number} />
            </Form>
          </Col>
        </Row>)}
    </>
  )
}

export default TruckInfo
