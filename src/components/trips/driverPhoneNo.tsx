import { Col, Tooltip, Form, Input, Space, Button } from 'antd'
import {SaveOutlined,} from '@ant-design/icons'


const phoneNumber = () => {

    return (
        <>
        <Col xs={7}>
                <Form.Item label='Driver Phone'>
                  <Tooltip
                    trigger={['hover']}
                    title='Enter 10 digit mobile number starting with 6 to 9'
                    placement='top'
                    overlayClassName='numeric-input'
                  >
                    <Input
                      id='driverNumber'
                      placeholder='Enter Driver Number'
                      maxLength={10}
                      disabled={false}
                    />
                  </Tooltip>
                </Form.Item>  
              </Col>
              <Col xs={1}>
              <Form.Item label>
              <Space>
              <Button type='primary' shape='circle' icon={<SaveOutlined />} />
              </Space>
              </Form.Item>
              </Col>
              </>
    )
}
export default phoneNumber