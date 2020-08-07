
import { Row, Col, Form, Input, Button } from 'antd'


const TruckInfo = (props) => {
  const {truck_info} = props

  console.log('truck_info',truck_info.length )
  return (
    
    <div>
      <Form layout='vertical'  >
        <Row gutter={10}>
          <Col span={6}>
          
            <Form.Item
              label='Length(Ft)'
              name='Length(Ft)'
              rules={[{ required: true, message: 'Length(Ft) is required field' }]}  
              initialValue={truck_info.length }
              
            >
              
              <Input placeholder='Length(Ft)' type='number' disabled={false}  />
          
            </Form.Item>
            
          </Col>
          <Col span={6}>
            <Form.Item
              label='Breadth(Ft)'
              name='Breadth(Ft)'
              rules={[{ required: true, message: 'Breadth(Ft) is required field' }]}
              initialValue={truck_info.breadth }
            >
              <Input placeholder='Breadth(Ft)' type='number' disabled={false} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label='Height(Ft)'
              name='Height(Ft)'
              rules={[{ required: true, message: 'Height(Ft) is required field' }]}
              initialValue={truck_info.height }
            >
              <Input placeholder='Height(Ft)' type='number' disabled={false} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='save' name='save' className='hideLabel'>
          <Button  type="primary"> Save </Button>
          </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label='Driver'
              name='Driver'
              rules={[{ required: true, message: 'Driver Number is required field' }]}
            >
              <Input placeholder='Driver Number' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default TruckInfo
