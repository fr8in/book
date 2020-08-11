
import { Row, Col, Form, Input, Button, message } from 'antd'
import { gql, useMutation } from '@apollo/client'
import Loading from '../common/loading'

const UPDATE_TRUCK_INFO_MUTATION = gql`
mutation TruckInfo($length:Int,$breadth:Int,$height:Int,$id:Int) {
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
  const { truck_info, id, loading } = props

  console.log('truck_info', truck_info)

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
        length: parseInt(form.length, 10),
        breadth: parseInt(form.breadth, 10),
        height: parseInt(form.height, 10)
      }
    })
  }

  const length = truck_info && truck_info.length ? truck_info.length : null
  const breadth = truck_info && truck_info.breadth ? truck_info.breadth : null
  const height = truck_info && truck_info.height ? truck_info.height : null
  console.log('length_breadth_height', length, breadth, height)

  return (
    <>
      {!loading ? (
        <Row>
          <Col sm={20}>
            <Form layout='vertical' onFinish={onDimensionSubmit}>
              <Row gutter={10}>
                <Col span={6}>
                  <Form.Item
                    label='Length(Ft)'
                    name='length'
                    rules={[{ required: true, message: 'Length(Ft) is required field' }]}
                    initialValue={length}
                  >
                    <Input type='number' placeholder='Length(Ft)' disabled={false} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label='Breadth(Ft)'
                    name='breadth'
                    rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
                    initialValue={breadth}
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
                    initialValue={height}
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
                    <Button type='primary' htmlType='submit'> Save </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={4}>
            <Form.Item
              label='Driver'
              name='Driver'
              rules={[{ required: true, message: 'Driver Number is required field' }]}
            >
              <Input placeholder='Driver Number' />
            </Form.Item>
          </Col>
        </Row>) : <Loading />}
    </>
  )
}

export default TruckInfo
