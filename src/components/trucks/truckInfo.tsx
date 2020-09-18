
import { Row, Col, Form, Input, Button, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import Driver from '../trucks/driver'

const UPDATE_TRUCK_INFO_MUTATION = gql`
mutation truck_info($length:float8,$breadth:float8,$height:float8,$id:Int!) {
  update_truck(_set: {length:$length,breadth:$breadth,height:$height}, where: {id: {_eq:$id }}){
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

  console.log('truck_info', truck_info)

  const driver_number = truck_info && truck_info.driver && truck_info.driver.mobile

  console.log('driver_number', driver_number)

  const [updateTruckInfo] = useMutation(
    UPDATE_TRUCK_INFO_MUTATION,
    {
      onError (error) { message.error(error.toString()) },
      onCompleted () { message.success('Saved!!') }
    }
  )

  const onDimensionSubmit = (form) => {
    updateTruckInfo({
      variables: {
        id: id,
        length: parseFloat(form.length),
        breadth: parseFloat(form.breadth),
        height: parseFloat(form.height)
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
                <Col span={6}>
                  <Form.Item
                    label='Length(Ft)'
                    name='length'
                    rules={[{ required: true, message: 'Length(Ft) is required field' }]}
                    initialValue={truck_info.length}
                  >
                    <Input type='number' placeholder='Length(Ft)' disabled={false} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label='Breadth(Ft)'
                    name='breadth'
                    rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
                    initialValue={truck_info.breadth}
                  >
                    <Input
                      type='number'
                      placeholder='Breadth(Ft)'
                      disabled={false}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label='Height(Ft)'
                    name='height'
                    rules={[{ required: true, message: 'Height(Ft) is required field' }]}
                    initialValue={truck_info.height}
                  >
                    <Input
                      placeholder='Height(Ft)'
                      type='number'
                      disabled={false}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label='save' name='save' className='hideLabel'>
                    <Button type='primary' htmlType='submit'>Save</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={4}>
            <Form layout='vertical'>
              <Driver partner_id={partner_id} truck_id={id} initialValue={driver_number} />
            </Form>
          </Col>
        </Row>)}
    </>
  )
}

export default TruckInfo
